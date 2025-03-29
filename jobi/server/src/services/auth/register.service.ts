import User from "../../models/mongodb/profiles/user.model";
import Otp from "../../models/mongodb/security/otp.model";
import Profile from "../../models/mongodb/profiles/profile.model";
import Security from "../../models/mongodb/security/security.model";
import { RegisterDtoType, RegisterDto } from "../../dto/auth/register.dto";
import { validateAndFormatData } from "../../utils/validateAndFormatData";
import { auth } from "../../config/firebase";
import { redisClient } from "../../config/redisConfig";
import { sendVerificationEmail } from "../../utils/sendEmail";
import { generateVerificationToken } from "../../utils/generateCode";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler } from "../../utils/responseHandler";
import { generateUniqueProfile } from "../../utils/generateUniqueProfileLink";
import dotenv from "dotenv";
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
      if (userData.password !== userData.confirmPassword) {
        return {
          success: false,
          status: 400,
          message: "Password and Confirm Password do not match.",
        };
      }

      const formatData = validateAndFormatData(userData, RegisterDto);
      if (!formatData.success) return formatData;

      const existingUser = await this.isUserExisting(
        userData.email,
        userData.mobile
      );
      if (!existingUser.success) return existingUser;

      // Add user caching & send otp
      const resultRegister = await this.processUserRegistration(
        formatData.data
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
      if (getUserByEmail) {
        return {
          success: false,
          status: 409,
          message: "Email already exists",
        };
      }

      if (getUserByPhone) {
        return {
          success: false,
          status: 409,
          message: "Phone already exists",
        };
      }
      return { success: true, status: 200 };
    }
  );

  // Update otp model to check user if verify email or not
  private processUserRegistration = warpAsync(
    async (userData: RegisterDtoType): Promise<responseHandler> => {
      const token = await this.generateUniqueToken();
      const existingOtp = await Otp.findOne({ email: userData.email }).lean();

      if (existingOtp) {
        return {
          success: false,
          status: 400,
          message:
            "verification link already exists or the email already register but not verify. Please check your email",
        };
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

      return {
        success: true,
        status: 200,
        message: "Registration successful. Please verify email",
      };
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
      // Find and delete token
      const getOtp = await Otp.findOneAndDelete({ token });

      if (!getOtp || getOtp.token != token) {
        return {
          success: false,
          status: 400,
          message:
            "Try verifying your email again ,Your request to verify your email has expired or the link has already been used",
        };
      }

      // Get user from caching
      const getUserFromCaching = await redisClient.get(`token: ${token}`);
      if (!getUserFromCaching || getUserFromCaching?.length === 0) {
        return {
          success: false,
          status: 400,
          message:
            "Try verifying your email again ,Your request to verify your email has expired or the link has already been used",
        };
      }

      // Create user in firebase
      const userData = JSON.parse(getUserFromCaching);
      const createUser = await auth.createUser({
        email: userData.email,
        phoneNumber: userData?.mobile,
        password: userData.password,
      });

      // Create user in user model
      const userUnique = await generateUniqueProfile(
        userData.firstName,
        userData.lastName
      );
      await User.create({
        userId: createUser.uid,
        userName: userUnique.userName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImage: userData.profileImage,
        coverImage: userData.coverImage,
        visibility: userData.visibility,
      });

      // Create user in security model
      await Security.create({
        userId: createUser.uid,
        email: userData.email,
        mobile: userData?.mobile,
        isEmailVerified: true,
        dateToJoin: Date.now(),
      });

      // Create user in profile model
      await Profile.create({
        userId: createUser.uid,
        profileLink: userUnique.profileLink,
      });

      // Delete User from caching
      await redisClient.del(`token: ${token}`);
      return {
        success: true,
        status: 201,
        message: "Registration successful. You can now log in.",
      };
    }
  );

  async verifyEmail(token: string): Promise<responseHandler> {
    const result = await this.addUserToDatabaseAndFirebase(token);
    if (!result.success) return result;
    return result;
  }
}

export default RegisterService;
