import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { encryptToken, decryptToken } from "../utils/encryptionToken";
import { CustomError } from "../utils/CustomError";
dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    curUser?: any;
  }
}

class TokenMiddleware {
  private static Instance: TokenMiddleware;

  public static getInstance() {
    if (!TokenMiddleware.Instance) {
      TokenMiddleware.Instance = new TokenMiddleware();
    }
    return TokenMiddleware.Instance;
  }

  public authorizationMiddleware(role: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!role.includes(req.curUser?.role)) {
        throw new CustomError("unauthorized: Access denied", false, 403);
      }
      return next();
    };
  }

  async refreshTokenMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new CustomError("Unauthorized: No refresh token", false, 401);
    }

    if (accessToken) {
      try {
        const decoded = jwt.verify(
          decryptToken(accessToken),
          String(process.env.ACCESS_TOKEN_SECRET)
        );
        req.curUser = decoded;
        return next();
      } catch (err) {}
    }

    try {
      const decoded = jwt.verify(
        decryptToken(refreshToken),
        String(process.env.REFRESH_TOKEN_SECRET)
      );

      if (typeof decoded !== "object" || decoded === null) {
        throw new CustomError(
          "Unauthorized: Invalid refresh token",
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
        maxAge: 60 * 60 * 1000,
      });

      req.curUser = payload;
      return next();
    } catch (err) {
      throw new CustomError("Invalid or expired refresh token", false, 401);
    }
  }
}
export default TokenMiddleware;
