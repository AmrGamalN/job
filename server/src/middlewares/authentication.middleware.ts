import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { encryptToken, decryptToken } from "../utils/encryptToken.util";
import { CustomError } from "../utils/customError.util";
import { asyncHandler } from "./handleError.middleware";
import { UserRequestType } from "../types/request.type";
dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    curUser: UserRequestType;
  }
}

class AuthenticationMiddleware {
  private static Instance: AuthenticationMiddleware;

  public static getInstance() {
    if (!AuthenticationMiddleware.Instance) {
      AuthenticationMiddleware.Instance = new AuthenticationMiddleware();
    }
    return AuthenticationMiddleware.Instance;
  }

  authorizationMiddleware = (role: string[]) => {
    return asyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        if (!role.includes(req.curUser?.role)) {
          throw new CustomError(
            "unauthorized: Access denied",
            "Forbidden",
            false,
            403
          );
        }
        return next();
      }
    );
  };

  refreshTokenMiddleware = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const accessToken = req.cookies?.accessToken;
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new CustomError(
          "Unauthorized: No refresh token",
          "Unauthorized",
          false,
          401
        );
      }

      if (accessToken) {
        try {
          const decoded = jwt.verify(
            decryptToken(accessToken),
            String(process.env.ACCESS_TOKEN_SECRET)
          );
          req.curUser = decoded as UserRequestType;
          return next();
        } catch (error) {}
      }

      const decoded = jwt.verify(
        decryptToken(refreshToken),
        String(process.env.REFRESH_TOKEN_SECRET)
      );

      if (typeof decoded !== "object") {
        throw new CustomError(
          "Unauthorized: Invalid refresh token",
          "Unauthorized",
          false,
          401
        );
      }

      const { iat, exp, ...payload } = decoded;
      const newAccessToken = jwt.sign(
        payload,
        String(process.env.ACCESS_TOKEN_SECRET),
        { expiresIn: "30m" }
      );

      res.cookie("accessToken", encryptToken(newAccessToken), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 60 * 1000,
      });

      req.curUser = payload as UserRequestType;
      return next();
    }
  );
}
export default AuthenticationMiddleware;
