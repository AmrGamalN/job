import { Request, Response } from "express";
import loginService from "../../services/auth/login.service";
import { auth } from "../../config/firebase";
import { encryptToken } from "../../utils/encryptionToken";

class LoginController {
  private static instance: LoginController;
  private loginService: loginService;

  constructor() {
    this.loginService = loginService.getInstance();
  }
  static getInstance(): LoginController {
    if (!LoginController.instance) {
      LoginController.instance = new LoginController();
    }
    return LoginController.instance;
  }

  // Login by email
  async loginByEmail(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const authResult = await this.loginService.Login(password, email, null);
    if (!authResult.success)
      return res.status(authResult.status!).json(authResult);
    const { refreshToken, accessToken, tempToken, userId, ...responseData } =
      authResult;
    this.generateCookies(res, refreshToken, accessToken, tempToken);
    this.loginService.updateUserStatus(userId, "active", "email");
    return res.status(200).json(responseData);
  }

  // Login by phone
  async loginByPhone(req: Request, res: Response): Promise<Response> {
    const { phoneNumber, password } = req.body;
    const authResult = await this.loginService.Login(
      password,
      null,
      phoneNumber
    );
    if (!authResult.success) return res.status(200).json(authResult);
    const { refreshToken, accessToken, tempToken, userId, ...responseData } =
      authResult;
    this.generateCookies(res, refreshToken, accessToken, tempToken);
    this.loginService.updateUserStatus(userId, "active", "phone");
    return res.status(200).json(responseData);
  }

  // Login by 2fa
  async verifyTwoFactorAuthentication(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { twoFactorCode } = req.body;
    const verificationResult =
      await this.loginService.verifyTwoFactorAuthentication(
        req.curUser.email,
        twoFactorCode
      );
    if (!verificationResult.success)
      return res.status(verificationResult.status!).json(verificationResult);

    const { refreshToken, accessToken, userId, ...responseData } =
      verificationResult;
    this.loginService.updateUserStatus(userId, "active");
    this.generateCookies(res, refreshToken, accessToken);
    return res.status(200).json(responseData);
  }

  // Logout
  async logOut(req: Request, res: Response): Promise<Response> {
    ["accessToken", "refreshToken"].forEach((cookieName) => {
      res.clearCookie(cookieName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    });
    await auth.revokeRefreshTokens(req.curUser.userId);
    this.loginService.updateUserStatus(req.curUser.userId, "inactive");
    return res.status(200).json({
      message: "Logged out successfully",
    });
  }

  private generateCookies(
    res: Response,
    refreshToken?: string,
    accessToken?: string,
    tempToken?: string
  ) {
    const options = {
      httpOnly: true,
      sameSite: "strict" as "strict",
      secure: process.env.NODE_ENV === "production",
    };
    const tokens = [
      {
        name: "refreshToken",
        value: refreshToken,
        expires: 60 * 24 * 7,
      },
      {
        name: "accessToken",
        value: accessToken,
        expires: 60,
      },
      {
        name: "tempToken",
        value: tempToken,
        expires: 15,
      },
    ];

    tokens.forEach((token) => {
      if (token.value != undefined) {
        res.cookie(token.name, encryptToken(String(token.value)), {
          ...options,
          expires: new Date(Date.now() + 1000 * 60 * token.expires),
        });
      }
    });
  }
}

export default LoginController;
