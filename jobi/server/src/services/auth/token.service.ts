import { warpAsync } from "../../utils/warpAsync";
import { responseHandler } from "../../utils/responseHandler";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserSecurityDtoType } from "../../dto/security/security.dto";
import User from "../../models/mongodb/profiles/user.model";
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
    async (email: string, role: string): Promise<responseHandler> => {
      const payload = {
        email: email,
        role: role,
      };
      const tempAccessToken = jwt.sign(
        payload,
        String(process.env.ACCESS_TOKEN_SECRET),
        {
          expiresIn: "5m",
          algorithm: "HS256",
        }
      );

      if (!tempAccessToken) {
        return {
          success: false,
          status: 400,
          message: "Failed to temp access token",
        };
      }
      return { success: true, tempAccessToken: tempAccessToken };
    }
  );

  // Generate temporarily token when login with two factor authentication
  generateTokens = warpAsync(
    async (userSecurity: UserSecurityDtoType): Promise<responseHandler> => {
      const user = await User.findOne({ userId: userSecurity.userId });
      const payload = {
        userId: userSecurity.userId,
        email: userSecurity.email,
        mobile: userSecurity.mobile,
        role: userSecurity.role,
        name: user?.firstName?.concat(String(user?.lastName)),
        profileImage: user?.profileImage,
        dateToJoin: userSecurity.dateToJoin,
        lastSeen: new Date().toISOString(),
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

      if (!accessToken || !refreshToken) {
        return {
          success: false,
          status: 400,
          message: "Failed to generate token",
        };
      }

      return {
        success: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    }
  );

  // Verify temporarily token
  verifyTempToken = warpAsync(
    async (authHeader: string): Promise<responseHandler> => {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(
        token,
        String(process.env.ACCESS_TOKEN_SECRET),
        {
          algorithms: ["HS256"],
        }
      );

      if (!decoded) {
        return {
          success: false,
          status: 400,
          message:
            "Two-factor authentication failed. Invalid or expired token.",
        };
      }
      return { success: true };
    }
  );
}

export default TokenService;
