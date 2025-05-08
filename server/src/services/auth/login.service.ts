import Security from "../../models/mongodb/client/security.model";
import {
  auth,
  authentication,
  signInWithEmailAndPassword,
} from "../../config/firebase";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { ServiceResponseType } from "../../types/response.type";
import dotenv from "dotenv";
import { SecurityDtoType } from "../../dto/client/security.dto";
import TokenService from "../../services/auth/token.service";
import speakeasy from "speakeasy";
import bcrypt from "bcrypt";
dotenv.config();

class LoginService {
  private static instanceService: LoginService;
  private tokenService: TokenService;
  constructor() {
    this.tokenService = TokenService.getInstance();
  }
  public static getInstance(): LoginService {
    if (!LoginService.instanceService) {
      LoginService.instanceService = new LoginService();
    }
    return LoginService.instanceService;
  }

  // Login by email or phone
  Login = warpAsync(
    async (
      password: string,
      email?: string,
      phoneNumber?: string
    ): Promise<ServiceResponseType> => {
      const credential = email
        ? { email: email }
        : { phoneNumber: phoneNumber };

      const isExisting = await this.checkUser(credential);
      if (isExisting.success === false) return isExisting;

      const checkUser = await Security.findOne(credential).lean();
      if (!checkUser)
        return serviceResponse({
          statusText: "NotFound",
          message: "Account not found",
        });

      const checkAccount = await this.checkStatusAccount(checkUser);
      if (!checkAccount.success) return checkAccount;

      const checkAttemptsLogin = await this.checkAttemptsLogin(
        checkUser,
        credential
      );
      if (!checkAttemptsLogin.success) return checkAttemptsLogin;

      let userCredential;
      if (email) {
        userCredential = await this.signWithPasswordAndEmail(email, password);
        if (!userCredential.success) return userCredential;
      }

      if (phoneNumber) {
        userCredential = await this.signWithPasswordAndPhone(
          password,
          checkUser.password,
          phoneNumber
        );
        if (!userCredential.success) return userCredential;
      }

      const check2FA = await this.checkApplyTwoFactorAuth(checkUser);
      if (check2FA.success) {
        const tempToken = await this.tokenService.generateTempToken(
          credential,
          checkUser.role
        );
        return {
          ...check2FA,
          tempToken: tempToken.tempToken,
          userId: checkUser.userId,
        };
      }

      const tokens = await this.tokenService.generateTokens(checkUser);
      return serviceResponse({
        statusText: "OK",
        message: "Login successful",
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          userId: checkUser.userId,
        },
      });
    }
  );

  updateUserStatus = warpAsync(
    async (
      userId: string,
      status: string,
      sign_in_provider: string
    ): Promise<ServiceResponseType> => {
      await Security.updateOne(
        {
          userId,
        },
        {
          $set: {
            status,
            sign_in_provider,
          },
        }
      ).lean();
      return { success: true };
    }
  );

  private checkUser = warpAsync(
    async (credential: any): Promise<ServiceResponseType> => {
      let getUser;
      let provider;
      if (credential.email) {
        provider = "email or password";
        getUser = await auth.getUserByEmail(credential.email).catch(() => null);
      }
      if (credential.phoneNumber) {
        provider = "phone or password";
        getUser = await auth
          .getUserByPhoneNumber(credential.phoneNumber)
          .catch(() => null);
      }
      if (!getUser)
        return serviceResponse({
          statusText: "NotFound",
          message: `User not exists, Please check your ${provider}`,
        });
      return { success: true };
    }
  );

  private signWithPasswordAndEmail = warpAsync(
    async (email: string, password: string): Promise<ServiceResponseType> => {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(
          authentication,
          email,
          password
        );

        await Security.updateOne(
          { email: email },
          { $set: { numberLogin: 0, lastFailedLoginTime: null } }
        );
      } catch (error: any) {
        if (error.code === "auth/invalid-credential") {
          this.trackFailedLoginAttempt(email, null);
          return serviceResponse({
            statusText: "Unauthorized",
            message: "Invalid email or password",
          });
        }
      }
      return { success: true, data: userCredential };
    }
  );

  private signWithPasswordAndPhone = warpAsync(
    async (
      plainPassword: string,
      hashPassword: string,
      phoneNumber: string
    ): Promise<ServiceResponseType> => {
      const comparePass = await bcrypt.compare(plainPassword, hashPassword);
      if (!comparePass) {
        this.trackFailedLoginAttempt(null, phoneNumber);
        return serviceResponse({
          statusText: "Unauthorized",
          message: "Invalid email or password",
        });
      }
      await Security.updateOne(
        { phoneNumber },
        { $set: { numberLogin: 0, lastFailedLoginTime: null } }
      );
      return { success: true };
    }
  );

  private checkStatusAccount = warpAsync(
    async (data: SecurityDtoType): Promise<ServiceResponseType> => {
      const statusMessage =
        (data.isAccountDeleted && "Account is deleted") ||
        (data.isAccountBlocked && "Account is blocked") ||
        (!data.isEmailVerified && "Email is not verified");
      if (statusMessage)
        return { success: false, status: 400, message: statusMessage };
      return { success: true };
    }
  );

  private checkAttemptsLogin = warpAsync(
    async (data: SecurityDtoType): Promise<ServiceResponseType> => {
      if (Number(data.numberLogin) >= 4) {
        const currentTime = Date.now();
        const lastFailedTime = new Date(
          data.lastFailedLoginTime as Date
        ).getTime();
        const timeDifference = (currentTime - lastFailedTime) / (1000 * 60);

        if (timeDifference < 10) {
          const remainingTime = Math.ceil(10 - timeDifference);
          return serviceResponse({
            statusText: "BadRequest",
            message: `Your account is temporarily locked due to multiple failed login attempts. Please try again in ${remainingTime} minutes or reset your password.`,
          });
        }

        await Security.updateOne(
          { email: data.email },
          { $set: { numberLogin: 0, lastFailedLoginTime: null } }
        );
      }
      return { success: true };
    }
  );

  private trackFailedLoginAttempt = warpAsync(
    async (email: string): Promise<ServiceResponseType> => {
      await Security.updateOne(
        { email },
        {
          $inc: { numberLogin: 1 },
          $set: { lastFailedLoginTime: new Date().toISOString() },
        }
      );
      return { success: true };
    }
  );

  private checkApplyTwoFactorAuth = warpAsync(
    async (data: SecurityDtoType): Promise<ServiceResponseType> => {
      if (data.isTwoFactorAuth)
        return serviceResponse({
          statusText: "OK",
          message: "2FA required",
        });
      return { success: false };
    }
  );

  verifyTwoFactorAuthentication = warpAsync(
    async (
      email: string,
      twoFactorCode: string
    ): Promise<ServiceResponseType> => {
      const data = await Security.findOne({
        email,
        isTwoFactorAuth: { $eq: true },
      })
        .select({
          isTwoFactorAuth: 1,
          twoFactorCode: 1,
          email: 1,
          role: 1,
          phoneNumber: 1,
          userId: 1,
          dateToJoin: 1,
          companyMemberId: 1,
        })
        .lean();

      if (!data)
        return serviceResponse({
          statusText: "BadRequest",
          message: "Invalid code",
        });

      const verified = speakeasy.totp.verify({
        secret: String(data.twoFactorCode),
        token: twoFactorCode,
        encoding: "base32",
        window: 1,
      });

      if (!verified)
        return serviceResponse({
          statusText: "BadRequest",
          message: "Invalid or expired 2FA code",
        });

      // Generate access token and refresh token
      const tokens = await this.tokenService.generateTokens(data);
      return serviceResponse({
        statusText: "OK",
        message: "Login successful",
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          userId: data.userId,
        },
      });
    }
  );
}

export default LoginService;
