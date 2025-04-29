import { Request, Response } from "express";
import ProfileService from "../../services/profiles/profile.service";
import { GraphQLResolveInfo } from "graphql";
import { ServiceResponseType } from "../../types/response.type";
import { controllerResponse } from "../../utils/response.util";

class ProfileController {
  private static instance: ProfileController;
  private profileService: ProfileService;
  constructor() {
    this.profileService = ProfileService.getInstance();
  }
  static getInstance(): ProfileController {
    if (!ProfileController.instance) {
      ProfileController.instance = new ProfileController();
    }
    return ProfileController.instance;
  }

  async getProfile(
    parent: any,
    args: {
      userId: string;
    },
    context: { req: Request; res: Response },
    info: GraphQLResolveInfo
  ): Promise<ServiceResponseType> {
    const userId = args.userId ? args.userId : context.req.curUser?.userId;
    const result = await this.profileService.getProfile(userId, info);
    if (!result.success) result;
    return result;
  }

  async getAllProfiles(
    parent: any,
    args: {
      page: number;
      limit: number;
    },
    context: { req: Request; res: Response },
    info: GraphQLResolveInfo
  ): Promise<ServiceResponseType> {
    const result = await this.profileService.getAllProfiles(args, info);
    if (!result.success) result;
    return result;
  }

  async getProfileByLink(req: Request, res: Response): Promise<Response> {
    const query = req.params.id
      ? { profileLink: process.env.BACKEND_URL + req.originalUrl }
      : { profileLink: req.curUser?.profileLink };
    const result = await this.profileService.getProfileByLink(query);
    return controllerResponse(res, result);
  }

  async updateProfile(req: Request, res: Response): Promise<Response> {
    const result = await this.profileService.updateProfile(
      req.body,
      req.body.id
    );
    return controllerResponse(res, result);
  }
}

export default ProfileController;
