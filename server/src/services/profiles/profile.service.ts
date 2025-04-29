import Profile from "../../models/mongodb/profiles/profile.model";
import {
  profileDto,
  profileUpdateDto,
  ProfileUpdateDtoType,
} from "../../dto/profiles/profile.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { ServiceResponseType } from "../../types/response.type";
import { validateAndFormatData } from "../../utils/validateData.util";
import { GraphQLResolveInfo } from "graphql";
import { paginate } from "../../utils/pagination.util";
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
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        profileData,
        profileUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

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
    async (query: object): Promise<ServiceResponseType> => {
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
    ): Promise<ServiceResponseType> => {
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
    ): Promise<ServiceResponseType> => {
      const count = await this.countProfile();
      return await paginate(Profile, profileDto, count.count ?? 0, args, info);
    }
  );

  countProfile = warpAsync(async (): Promise<ServiceResponseType> => {
    return serviceResponse({
      statusText: "OK",
      count: await Profile.countDocuments(),
    });
  });
}

export default ProfileService;
