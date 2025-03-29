import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
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

  // Verify access token middleware
  async accessTokenMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "unauthorized: No token provided." });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET), {
      algorithms: ["HS256"],
    });
    if (!decoded) {
      res.status(401).json({ message: "Invalid or expired token." });
      return;
    }

    req.curUser = decoded;
    next();
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
        next();
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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No access token." });
    }

    const refreshToken = req.cookies?.RefreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No refresh token." });
    }

    const accessToken = authHeader.split(" ")[1];
    jwt.verify(
      accessToken,
      String(process.env.ACCESS_TOKEN_SECRET),
      (err, decoded) => {
        if (!err) {
          req.curUser = decoded;
          return next();
        }

        jwt.verify(
          refreshToken,
          String(process.env.REFRESH_TOKEN_SECRET),
          (err: any, decoded: any) => {
            if (err) {
              return res
                .status(403)
                .json({ message: "Invalid refresh token." });
            }

            const newAccessToken = jwt.sign(
              { ...decoded },
              String(process.env.ACCESS_TOKEN_SECRET),
              { expiresIn: "30m" }
            );

            res.setHeader("Authorization", `Bearer ${newAccessToken}`);
            req.curUser = decoded;
            return next();
          }
        );
      }
    );
  }
}
export default TokenMiddleware;
