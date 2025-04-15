import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { encryptToken, decryptToken } from "../utils/encryptionToken";
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

  // Authorization middleware & allow to
  public authorizationMiddleware(role: string[]) {
    try {
      return async (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.curUser?.role;
        if (!userRole) {
          res.status(401).json({ error: "unauthorized: No user role found" });
          return;
        }
        if (!role.includes(userRole)) {
          res.status(403).json({ error: "Forbidden: Access denied" });
          return;
        }
        return next();
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Internal server error"
      );
    }
  }

  // Verify refresh token middleware and create new access token
  async refreshTokenMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No refresh token." });
    }

    if (accessToken) {
      try {
        const decoded = jwt.verify(decryptToken(accessToken), "slat");
        req.curUser = decoded;
        return next();
      } catch (err) {
        return res
          .status(403)
          .json({ message: "Unauthorized: No access token." });
      }
    }

    // Access token is missing or invalid — verify refresh token
    try {
      const decoded = jwt.verify(
        decryptToken(refreshToken),
        String(process.env.REFRESH_TOKEN_SECRET)
      );

      if (typeof decoded !== "object" || decoded === null) {
        return res
          .status(403)
          .json({ message: "Invalid or expired refresh token." });
      }
      const { iat, exp, ...payload } = decoded;
      const newAccessToken = jwt.sign(
        payload,
        String(process.env.ACCESS_TOKEN_SECRET),
        { expiresIn: "30m" }
      );

      // Set the new access token as an httpOnly cookie
      res.cookie("accessToken", encryptToken(newAccessToken), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      req.curUser = decoded;
      return next();
    } catch (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token." });
    }
  }
}
export default TokenMiddleware;
