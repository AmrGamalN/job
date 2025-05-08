import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { SecurityDtoType } from "../../dto/client/security.dto";
import User from "../../models/mongodb/client/user.model";
import Profile from "../../models/mongodb/client/profile.model";
import Security from "../../models/mongodb/client/security.model";
import { ServiceResponseType } from "../../types/response.type";
dotenv.config();

class TokenService {
  private static instanceService: TokenService;
  public static getInstance(): TokenService {
    if (!TokenService.instanceService) {
      TokenService.instanceService = new TokenService();
    }
    return TokenService.instanceService;
  }

  // Generate temporarily token when login with two factor authentication
  generateTempToken = warpAsync(
    async (email: string, role: string): Promise<ServiceResponseType> => {
      const payload = {
        email: email,
        role: role,
      };
      const tempToken = jwt.sign(
        payload,
        String(process.env.ACCESS_TOKEN_SECRET),
        {
          expiresIn: "5m",
          algorithm: "HS256",
        }
      );
      if (!tempToken)
        return serviceResponse({
          statusText: "Unauthorized",
          message: "Failed to login, please try again later",
        });
      return { success: true, tempToken: tempToken };
    }
  );

  // Generate temporarily token when login with two factor authentication
  generateTokens = warpAsync(
    async (userSecurity: SecurityDtoType): Promise<ServiceResponseType> => {
      const [user, profile, security] = await Promise.all([
        User.findOne({ userId: userSecurity.userId }).lean().select({
          firstName: 1,
          lastName: 1,
          userName: 1,
          profileImage: 1,
        }),
        Profile.findOne({ userId: userSecurity.userId }).lean().select({
          profileLink: 1,
        }),
        Security.findOne({ userId: userSecurity.userId }).lean().select({
          company: 1,
        }),
      ]);
      if (!user || !profile || !security)
        return serviceResponse({
          statusText: "Unauthorized",
          message: "Failed to login, please try again later",
        });

      const payload = {
        userId: userSecurity.userId,
        email: userSecurity.email,
        userName: user?.userName,
        profileLink: profile?.profileLink,
        phoneNumber: userSecurity.phoneNumber,
        role: userSecurity.role,
        name: `${user?.firstName} ${user?.lastName}`,
        profileImage: user?.profileImage?.url,
        dateToJoin: userSecurity.dateToJoin,
        lastSeen: new Date().toISOString(),
        sign_with: userSecurity.sign_in_provider,
        emailVerified: userSecurity.isEmailVerified,
        visibility: user.visibility,
        company: security?.company,
      };
      const accessToken = jwt.sign(
        payload,
        String(process.env.ACCESS_TOKEN_SECRET),
        {
          expiresIn: "30m",
          algorithm: "HS256",
        }
      );

      const refreshToken = jwt.sign(
        payload,
        String(process.env.REFRESH_TOKEN_SECRET),
        {
          expiresIn: "7d",
          algorithm: "HS256",
        }
      );

      if (!accessToken || !refreshToken)
        return serviceResponse({
          statusText: "Unauthorized",
          message: "Failed to login, please try again later",
        });

      return {
        success: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    }
  );

  // Verify temporarily token
  verifyTempToken = warpAsync(
    async (authHeader: string): Promise<ServiceResponseType> => {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(
        token,
        String(process.env.ACCESS_TOKEN_SECRET),
        {
          algorithms: ["HS256"],
        }
      );

      if (!decoded)
        return serviceResponse({
          statusText: "Unauthorized",
          message: "Two-factor authentication failed. please try again later",
        });
      return { success: true };
    }
  );
}

export default TokenService;
