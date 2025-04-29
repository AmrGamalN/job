import { Request, Response } from "express";
import SecurityService from "../../services/profiles/security.service";
import { GraphQLResolveInfo } from "graphql";
import { ServiceResponseType } from "../../types/response.type";
import { controllerResponse } from "../../utils/response.util";

class SecurityController {
  private static instance: SecurityController;
  private SecurityService: SecurityService;
  constructor() {
    this.SecurityService = SecurityService.getInstance();
  }
  static getInstance(): SecurityController {
    if (!SecurityController.instance) {
      SecurityController.instance = new SecurityController();
    }
    return SecurityController.instance;
  }

  async getSecurity(
    parent: any,
    args: {
      userId: string;
    },
    context: { req: Request; res: Response },
    info: GraphQLResolveInfo
  ): Promise<ServiceResponseType> {
    const result = await this.SecurityService.getSecurity(args, info);
    if (!result.success) return result;
    return result;
  }

  async getAllSecurities(
    parent: any,
    args: {
      page: number;
      limit: number;
    },
    context: { req: Request; res: Response },
    info: GraphQLResolveInfo
  ): Promise<ServiceResponseType> {
    const result = await this.SecurityService.getAllSecurities(args, info);
    if (!result.success) result;
    return result;
  }

  async updateSecurity(req: Request, res: Response): Promise<Response> {
    const userId = req.params.userId ? req.params.userId : req.curUser?.userId;
    const result = await this.SecurityService.updateSecurity(req.body, userId);
    return controllerResponse(res, result);
  }

  async countSecurity(req: Request, res: Response): Promise<Response> {
    const result = await this.SecurityService.countSecurity();
    return controllerResponse(res, result);
  }

  // Delete & block
  async deleteBlockUser(req: Request, res: Response): Promise<Response> {
    const result = await this.SecurityService.deleteBlockUser(
      req.body.userId,
      req.body.block !== undefined
        ? { isAccountBlocked: req.body.block }
        : { isAccountDeleted: req.body.delete }
    );
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(200).json(result);
  }

  // Reset password
  async resetPassword(req: Request, res: Response): Promise<Response> {
    const result = await this.SecurityService.resetPassword(req.body.email);
    return controllerResponse(res, result);
  }

  // Update password
  async updatePassword(req: Request, res: Response): Promise<Response> {
    const result = await this.SecurityService.updatePassword(
      req.curUser.userId,
      req.body
    );
    return controllerResponse(res, result);
  }

  // Send verification again
  async sendEmail(req: Request, res: Response): Promise<Response> {
    const result = await this.SecurityService.sendEmail(req.body.email);
    return controllerResponse(res, result);
  }

  // Generate two factor authentication
  async generateTwoFactorAuth(req: Request, res: Response): Promise<Response> {
    const result = await this.SecurityService.generateTwoFactorAuth(
      req.curUser.userId
    );
    if (!result.success) return res.status(result.status!).json(result);
    res.setHeader("Content-type", "image/png");
    res.setHeader("Content-Disposition", "inline;filename=qrcode.png");
    return res.send(result.data.qrCode);
  }

  // Verify two factor authentication
  async verifyTwoFactorAuth(req: Request, res: Response): Promise<Response> {
    const result = await this.SecurityService.verifyTwoFactorAuth(
      req.curUser.userId,
      req.body.twoFactorCode
    );
    return controllerResponse(res, result);
  }
}

export default SecurityController;
