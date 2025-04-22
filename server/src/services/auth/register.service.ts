import User from "../../models/mongodb/profiles/user.model";
import Otp from "../../models/mongodb/profiles/otp.model";
import Profile from "../../models/mongodb/profiles/profile.model";
import Security from "../../models/mongodb/profiles/security.model";
import { RegisterDtoType, RegisterDto } from "../../dto/auth/register.dto";
import { validateAndFormatData } from "../../utils/validateAndFormatData";
import { auth } from "../../config/firebase";
import { redisClient } from "../../config/redisConfig";
import { sendVerificationEmail } from "../../utils/sendEmail";
import { generateVerificationToken } from "../../utils/generateCode";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler, serviceResponse } from "../../utils/responseHandler";
import { generateUniqueProfile } from "../../utils/generateUniqueProfileLink";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Interest from "../../models/mongodb/profiles/interest.model";
dotenv.config();

class RegisterService {
  private static instanceService: RegisterService;
  public static getInstance(): RegisterService {
    if (!RegisterService.instanceService) {
      RegisterService.instanceService = new RegisterService();
    }
    return RegisterService.instanceService;
  }

  // register new user
  register = warpAsync(
    async (userData: RegisterDtoType): Promise<responseHandler> => {
      if (userData.password !== userData.confirmPassword)
        return serviceResponse({
          statusText: "BadRequest",
          message: "Password and Confirm Password do not match.",
        });

      const parsedSafe = validateAndFormatData(userData, RegisterDto);
      if (!parsedSafe.success) return parsedSafe;

      const existingUser = await this.isUserExisting(
        userData.email,
        userData.phoneNumber
      );
      if (!existingUser.success) return existingUser;

      // Add user caching & send otp
      const resultRegister = await this.processUserRegistration(
        parsedSafe.data
      );
      if (!resultRegister.success) return resultRegister;

      return resultRegister;
    }
  );

  // Check user existing
  private isUserExisting = warpAsync(
    async (email: string, phoneNumber: string): Promise<responseHandler> => {
      const getUserByEmail = await auth.getUserByEmail(email).catch(() => null);
      const getUserByPhone = await auth
        .getUserByPhoneNumber(phoneNumber)
        .catch(() => null);
      if (getUserByEmail)
        return serviceResponse({
          statusText: "Conflict",
          message: "Email already exists",
        });

      if (getUserByPhone)
        return serviceResponse({
          statusText: "Conflict",
          message: "Phone already exists",
        });
      return { success: true };
    }
  );

  // Update otp model to check user if verify email or not
  private processUserRegistration = warpAsync(
    async (userData: RegisterDtoType): Promise<responseHandler> => {
      const token = await this.generateUniqueToken();
      const existingOtp = await Otp.findOne({ email: userData.email }).lean();
      if (existingOtp) {
        return serviceResponse({
          statusText: "Conflict",
          message:
            "verification link already exists or the email already register but not verify. Please check your email",
        });
      } else {
        await Otp.create({
          email: userData.email,
          token,
          expiresAt: new Date(Date.now() + 20 * 60 * 1000),
        });
      }

      // If not verify and not exist in firebase so send verification link
      const verificationLink = `${process.env.BACKEND_URL}/api/v1/auth/verify-email/${token}`;
      const resultSendEmail = await sendVerificationEmail(
        String(userData.email),
        verificationLink,
        "Verify Your Email",
        "Please verify your email by clicking the following link."
      );
      if (!resultSendEmail.success) return resultSendEmail;

      // Add user in caching
      const resultCache = await this.saveUserInCache(userData, token);
      if (!resultCache.success) return resultCache;

      return serviceResponse({
        statusText: "OK",
        message: "Registration successful. Please verify email",
      });
    }
  );

  // Create unique token
  private async generateUniqueToken(): Promise<string> {
    let token;
    do {
      token = generateVerificationToken();
    } while (await Otp.exists({ token }));
    return token;
  }

  // Save user in caching
  private saveUserInCache = warpAsync(
    async (
      userData: RegisterDtoType,
      token: string
    ): Promise<responseHandler> => {
      const result = await redisClient.setEx(
        `token: ${token}`,
        1200,
        JSON.stringify(userData)
      );

      if (result !== "OK") {
        return {
          success: false,
          status: 500,
          message: "Failed to save user in cache",
        };
      }
      return { success: true };
    }
  );

  // Add user in database after verification
  private addUserToDatabaseAndFirebase = warpAsync(
    async (token: string): Promise<responseHandler> => {
      const getOtp = await Otp.findOneAndDelete({ token });
      const getUserFromCaching = await redisClient.get(`token: ${token}`);

      if (
        !getOtp ||
        getOtp.token != token ||
        !getUserFromCaching ||
        getUserFromCaching?.length === 0
      )
        return serviceResponse({
          statusText: "BadRequest",
          message:
            "Try verifying your email again ,Your request to verify your email has expired or the link has already been used",
        });

      const userData = JSON.parse(getUserFromCaching);
      const {
        email,
        password,
        phoneNumber,
        firstName,
        lastName,
        gender,
        terms,
      } = userData;
      const [firebaseUser] = await Promise.all([
        auth.createUser({ email, password, phoneNumber }),
      ]);
      const userId = firebaseUser.uid;
      const prefixS3 = uuidv4();
      const userUnique = await generateUniqueProfile(
        userData.firstName,
        userData.lastName
      );
      await Promise.all([
        User.create({
          prefixS3,
          userId,
          firstName,
          lastName,
          gender,
          userName: userUnique.userName,
        }),
        Security.create({
          userId,
          email,
          phoneNumber,
          password: await bcrypt.hash(password, 10),
          isEmailVerified: true,
          dateToJoin: Date.now(),
          terms,
          sign_up_provider: "email",
        }),
        Profile.create({
          userId,
          profileLink: userUnique.profileLink,
        }),
        Interest.create({ userId }),
        redisClient.del(`token: ${token}`),
      ]);
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  async verifyEmail(token: string): Promise<responseHandler> {
    const result = await this.addUserToDatabaseAndFirebase(token);
    if (!result.success) return result;
    return result;
  }
}

export default RegisterService;
