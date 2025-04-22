import Profile from "../../models/mongodb/profiles/profile.model";
import {
  profileDto,
  profileUpdateDto,
  ProfileUpdateDtoType,
} from "../../dto/profiles/profile.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler, serviceResponse } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";
import { GraphQLResolveInfo } from "graphql";
import { PaginationGraphQl } from "../../utils/pagination";
const graphqlFields = require("graphql-fields");

class ProfileService {
  private static instanceService: ProfileService;
  public static getInstance(): ProfileService {
    if (!ProfileService.instanceService) {
      ProfileService.instanceService = new ProfileService();
    }
    return ProfileService.instanceService;
  }

  updateProfile = warpAsync(
    async (
      profileData: ProfileUpdateDtoType,
      query: object
    ): Promise<responseHandler> => {
      const parsed = validateAndFormatData(
        profileData,
        profileUpdateDto,
        "update"
      );
      if (!parsed.success) return parsed;

      const updateProfile = await Profile.findOneAndUpdate(
        query,
        {
          $set: {
            ...profileData,
          },
        },
        {
          new: true,
        }
      ).lean();
      return serviceResponse({
        data: updateProfile,
      });
    }
  );

  getProfileByLink = warpAsync(
    async (query: object): Promise<responseHandler> => {
      const getProfile = await Profile.findOne(query).lean();
      return validateAndFormatData(getProfile, profileDto);
    }
  );

  getProfile = warpAsync(
    async (
      args: {
        userId: string;
      },
      info: any
    ): Promise<responseHandler> => {
      const selectedFields = Object.keys(graphqlFields(info).data || {}).join(
        " "
      );
      const getProfile = await Profile.findOne({ userId: args })
        .select(selectedFields)
        .lean();
      return validateAndFormatData(getProfile, profileDto);
    }
  );

  getAllProfiles = warpAsync(
    async (
      args: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo
    ): Promise<responseHandler> => {
      const count = await this.countProfile();
      return await PaginationGraphQl(
        Profile,
        profileDto,
        count.count ?? 0,
        args,
        info
      );
    }
  );

  countProfile = warpAsync(async (): Promise<responseHandler> => {
    return serviceResponse({
      statusText: "OK",
      count: await Profile.countDocuments(),
    });
  });
}

export default ProfileService;
