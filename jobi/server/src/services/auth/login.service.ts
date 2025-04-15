import Security from "../../models/mongodb/profiles/security.model";
import {
  auth,
  authentication,
  signInWithEmailAndPassword,
} from "../../config/firebase";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler } from "../../utils/responseHandler";
import dotenv from "dotenv";
import { UserSecurityDtoType } from "../../dto/profiles/security.dto";
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
    ): Promise<responseHandler> => {
      const credential = email
        ? { email: email }
        : { phoneNumber: phoneNumber };

      const isUserExisting = await this.isUserExisting(credential);
      if (isUserExisting.success === false) return isUserExisting;

      const userSecurity = await Security.findOne(credential).lean();
      if (!userSecurity) {
        return { success: false, status: 404, message: "Account not found" };
      }

      const checkAccountStatus = await this.checkAccountStatusBeforeLogin(
        userSecurity
      );
      if (!checkAccountStatus.success) return checkAccountStatus;

      const checkAttemptsLogin = await this.checkAttemptsLogin(
        userSecurity,
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
          userSecurity.password,
          phoneNumber
        );
        if (!userCredential.success) return userCredential;
      }

      const checkEnable2FA = await this.checkApplyTwoFactorAuth(userSecurity);
      if (checkEnable2FA.success) {
        const tempToken = await this.tokenService.generateTempToken(
          credential,
          userSecurity.role
        );
        return {
          ...checkEnable2FA,
          tempToken: tempToken.tempToken,
          userId: userSecurity.userId,
        };
      }

      const tokens = await this.tokenService.generateTokens(userSecurity);
      return {
        success: true,
        status: 200,
        message: "Login successful",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: userSecurity.userId,
      };
    }
  );

  updateUserStatus = warpAsync(
    async (
      userId: string,
      status: string,
      sign_in_provider: string
    ): Promise<responseHandler> => {
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

  // Check user existing
  private isUserExisting = warpAsync(
    async (credential: any): Promise<responseHandler> => {
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
      if (!getUser) {
        return {
          success: false,
          status: 404,
          message: `User not exists, Please check your ${provider}`,
        };
      }
      return { success: true, status: 200 };
    }
  );

  // Login with email and password
  private signWithPasswordAndEmail = warpAsync(
    async (email: string, password: string): Promise<responseHandler> => {
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
          return {
            success: false,
            status: 401,
            message: "Invalid email or password",
          };
        }
      }
      return { success: true, data: userCredential };
    }
  );

  // Login with phone and password
  private signWithPasswordAndPhone = warpAsync(
    async (
      plainPassword: string,
      hashPassword: string,
      phoneNumber: string
    ): Promise<responseHandler> => {
      const comparePass = await bcrypt.compare(plainPassword, hashPassword);
      if (!comparePass) {
        this.trackFailedLoginAttempt(null, phoneNumber);
        return {
          success: false,
          status: 401,
          message: "Invalid phone or password",
        };
      }
      await Security.updateOne(
        { phoneNumber },
        { $set: { numberLogin: 0, lastFailedLoginTime: null } }
      );
      return { success: true };
    }
  );

  // Check user account delete | block | verify
  private checkAccountStatusBeforeLogin = warpAsync(
    async (userSecurity: UserSecurityDtoType): Promise<responseHandler> => {
      const statusMessage =
        (userSecurity.isAccountDeleted && "Account is deleted") ||
        (userSecurity.isAccountBlocked && "Account is blocked") ||
        (!userSecurity.isEmailVerified && "Email is not verified");
      if (statusMessage)
        return { success: false, status: 400, message: statusMessage };
      return { success: true };
    }
  );

  // Check number attempts failed Login
  private checkAttemptsLogin = warpAsync(
    async (userSecurity: UserSecurityDtoType): Promise<responseHandler> => {
      if (Number(userSecurity.numberLogin) >= 4) {
        const currentTime = Date.now();
        const lastFailedTime = new Date(
          userSecurity.lastFailedLoginTime as Date
        ).getTime();
        const timeDifference = (currentTime - lastFailedTime) / (1000 * 60);

        if (timeDifference < 10) {
          const remainingTime = Math.ceil(10 - timeDifference);
          return {
            success: false,
            status: 400,
            message: `Your account is temporarily locked due to multiple failed login attempts. Please try again in ${remainingTime} minutes or reset your password.`,
          };
        }

        await Security.updateOne(
          { email: userSecurity.email },
          { $set: { numberLogin: 0, lastFailedLoginTime: null } }
        );
      }
      return { success: true };
    }
  );

  // Update number of failed login
  private trackFailedLoginAttempt = warpAsync(
    async (email: string): Promise<responseHandler> => {
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

  // Check apply Two factor authentication
  private checkApplyTwoFactorAuth = warpAsync(
    async (userSecurity: UserSecurityDtoType): Promise<responseHandler> => {
      if (userSecurity.isTwoFactorAuth) {
        return {
          success: true,
          status: 200,
          message: "2FA required",
          userId: userSecurity.userId,
        };
      }
      return { success: false };
    }
  );

  // Verify two factor authentication
  verifyTwoFactorAuthentication = warpAsync(
    async (email: string, twoFactorCode: string): Promise<responseHandler> => {
      // Get user security details
      const userSecurity = await Security.findOne({
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
        })
        .lean();

      if (!userSecurity) {
        return {
          success: false,
          status: 400,
          message: "Invalid code",
        };
      }

      const verified = speakeasy.totp.verify({
        secret: String(userSecurity.twoFactorCode),
        token: twoFactorCode,
        encoding: "base32",
        window: 1,
      });

      if (!verified) {
        return {
          success: false,
          status: 400,
          message: "Invalid or expired 2FA code",
        };
      }

      // Generate access token and refresh token
      const tokens = await this.tokenService.generateTokens(userSecurity);
      return {
        success: true,
        status: 200,
        message: "Login successful",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: userSecurity.userId,
      };
    }
  );
}

export default LoginService;
