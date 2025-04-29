import { Request, Response } from "express";
import loginService from "../../services/auth/login.service";
import { auth } from "../../config/firebase";
import { encryptToken } from "../../utils/encryptToken.util";

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

  async loginByEmail(req: Request, res: Response): Promise<Response> {
    const authResult = await this.loginService.Login(
      req.body.password,
      req.body.email,
      null
    );
    if (!authResult.success)
      return res.status(authResult.status!).json(authResult);
    const { data, ...responseData } = authResult;
    this.generateCookies(res, data);
    this.loginService.updateUserStatus(data.userId, "active", "email");
    return res.status(200).json(responseData);
  }

  async loginByPhone(req: Request, res: Response): Promise<Response> {
    const authResult = await this.loginService.Login(
      req.body.password,
      null,
      req.body.phoneNumber
    );
    if (!authResult.success) return res.status(200).json(authResult);
    const { data, ...responseData } = authResult;
    this.generateCookies(res, data);
    this.loginService.updateUserStatus(data.userId, "active", "phone");
    return res.status(200).json(responseData);
  }

  async verifyTwoFactorAuthentication(
    req: Request,
    res: Response
  ): Promise<Response> {
    const authResult = await this.loginService.verifyTwoFactorAuthentication(
      req.curUser.email,
      req.body.twoFactorCode
    );
    if (!authResult.success)
      return res.status(authResult.status!).json(authResult);
    const { data, ...responseData } = authResult;
    this.generateCookies(res, data);
    this.loginService.updateUserStatus(data.userId, "active");
    return res.status(200).json(responseData);
  }

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
      success: true,
      status: 200,
    });
  }

  private generateCookies(
    res: Response,
    data: { refreshToken?: string; accessToken?: string; tempToken?: string }
  ) {
    const options = {
      httpOnly: true,
      sameSite: "strict" as "strict",
      secure: process.env.NODE_ENV === "production",
    };
    const tokens = [
      {
        name: "refreshToken",
        value: data.refreshToken,
        expires: 60 * 24 * 7,
      },
      {
        name: "accessToken",
        value: data.accessToken,
        expires: 60,
      },
      {
        name: "tempToken",
        value: data.tempToken,
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
