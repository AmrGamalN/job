import { Request, Response } from "express";
import loginService from "../../services/auth/login.service";
import { auth } from "../../config/firebase";

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

  // Authenticate user with email and password, then set a refresh token in a secure cookie
  async loginByEmail(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authResult = await this.loginService.loginByEmail(email, password);
    if (!authResult.success)
      return res.status(authResult.status!).json(authResult);

    const { refreshToken, userId, ...responseData } = authResult;
    this.generateCookies(res, refreshToken!);
    this.loginService.updateUserStatus(userId, "active");
    return res.status(200).json(responseData);
  }

  // Verify two-factor authentication (2FA) and issue new tokens if verification succeeds
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

    const { refreshToken, userId, ...responseData } = verificationResult;
    this.loginService.updateUserStatus(userId, "active");
    this.generateCookies(res, refreshToken!);
    return res.status(200).json(responseData);
  }

  // Logout
  async logOut(req: Request, res: Response): Promise<Response> {
    res.clearCookie("RefreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.removeHeader("Authorization");

    await auth.revokeRefreshTokens(req.curUser.userId);
    this.loginService.updateUserStatus(req.curUser.userId, "inactive");

    return res.status(200).json({
      message: "Logged out successfully, clear access token from frontend.",
    });
  }

  // Generate cookies
  private generateCookies(res: Response, refreshToken: string) {
    res.cookie("RefreshToken", refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  }
}

export default LoginController;
