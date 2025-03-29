import Security from "../../models/mongodb/security/security.model";
import {
  auth,
  authentication,
  signInWithEmailAndPassword,
} from "../../config/firebase";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler } from "../../utils/responseHandler";
import dotenv from "dotenv";
import { UserSecurityDtoType } from "../../dto/security/security.dto";
import TokenService from "../../services/auth/token.service";
import speakeasy from "speakeasy";
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

  // Login by email
  loginByEmail = warpAsync(
    async (email: string, password: string): Promise<responseHandler> => {
      const isUserExisting = await this.isUserExisting(email);
      if (isUserExisting.success === false) return isUserExisting;

      const userSecurity = await Security.findOne({
        email: email,
      }).lean();
      if (!userSecurity) {
        return { success: false, message: "Account not found" };
      }

      // Check user status
      const checkAccountStatus = await this.checkAccountStatusBeforeLogin(
        userSecurity
      );
      if (!checkAccountStatus.success) return checkAccountStatus;

      // Check user attempt failed login
      const checkAttemptsLogin = await this.checkAttemptsLogin(userSecurity);
      if (!checkAttemptsLogin.success) return checkAttemptsLogin;

      // SignIn with email & password
      const userCredential = await this.signWithPasswordAndEmail(
        email,
        password
      );
      if (!userCredential.success) return userCredential;

      // Check two factor authentication
      const checkEnable2FA = await this.checkApplyTwoFactorAuth(userSecurity);
      if (checkEnable2FA.success) {
        const tempToken = await this.tokenService.generateTempToken(
          userSecurity.email,
          userSecurity.role
        );

        return {
          ...checkEnable2FA,
          tempAccessToken: tempToken.tempAccessToken,
          userId: userSecurity.userId,
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

  updateUserStatus = warpAsync(
    async (userId: string, status: string): Promise<responseHandler> => {
      await Security.updateOne(
        {
          userId,
        },
        {
          $set: {
            status,
          },
        }
      ).lean();
      return { success: true };
    }
  );

  // Check user existing
  private isUserExisting = warpAsync(
    async (email: string): Promise<responseHandler> => {
      const getUserByEmail = await auth.getUserByEmail(email).catch(() => null);
      if (!getUserByEmail) {
        return {
          success: false,
          status: 404,
          message: "Email not exists, Please check your email or password",
        };
      }
      return { success: true };
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
          { email },
          { $set: { numberLogin: 0, lastFailedLoginTime: null } }
        );
      } catch (error: any) {
        if (error.code === "auth/invalid-credential") {
          this.trackFailedLoginAttempt(email);
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
          mobile: 1,
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
      };
    }
  );
}

export default LoginService;
