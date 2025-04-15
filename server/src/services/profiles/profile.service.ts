import Profile from "../../models/mongodb/profiles/profile.model";
import {
  profileDto,
  profileUpdateDto,
  ProfileUpdateDtoType,
} from "../../dto/profiles/profile.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";
import { GraphQLResolveInfo } from "graphql";
const graphqlFields = require("graphql-fields");

class ProfileService {
  private static instanceService: ProfileService;
  public static getInstance(): ProfileService {
    if (!ProfileService.instanceService) {
      ProfileService.instanceService = new ProfileService();
    }
    return ProfileService.instanceService;
  }

  // Update profile
  updateProfile = warpAsync(
    async (
      profileData: ProfileUpdateDtoType,
      query: object
    ): Promise<responseHandler> => {
      if (Object.keys(profileData).length === 0) {
        return {
          success: false,
          status: 400,
          message: "No data provided for update",
        };
      }

      const parseSafe = validateAndFormatData(profileData, profileUpdateDto);
      if (!parseSafe.success) return parseSafe;

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

      if (!updateProfile) {
        return {
          success: false,
          status: 404,
          message: "Profile not found",
        };
      }

      return {
        success: true,
        status: 200,
        message: "Update profile successfully",
        data: updateProfile,
      };
    }
  );

  // Get profile model by using GraphQl to select any field is need
  getProfileByLink = warpAsync(
    async (query: object): Promise<responseHandler> => {
      const getProfile = await Profile.findOne(query).lean();
      if (!getProfile) {
        return {
          success: false,
          status: 404,
          message: "Profile not found",
        };
      }

      const parseSafeProfile = validateAndFormatData(getProfile, profileDto);
      if (!parseSafeProfile.success) return parseSafeProfile;

      return {
        success: true,
        status: 200,
        message: "Get profile successfully",
        data: getProfile,
      };
    }
  );

  // Get profile model by using GraphQl to select any field is need
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

      if (!getProfile) {
        return {
          success: false,
          status: 404,
          message: "Profile not found",
        };
      }

      const parseSafeProfile = validateAndFormatData(getProfile, profileDto);
      if (!parseSafeProfile.success) return parseSafeProfile;

      return {
        success: true,
        status: 200,
        message: "Get profile successfully",
        data: getProfile,
      };
    }
  );

  // Get all profile model by using GraphQl to select any field is need
  getAllProfiles = warpAsync(
    async (
      args: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo
    ): Promise<responseHandler> => {
      const pageNum = Math.max(args.page, 1);
      const limitNum = Math.max(args.limit, 10);
      const skip = (pageNum - 1) * limitNum;
      const selectedFields = Object.keys(graphqlFields(info).data || {}).join(
        " "
      );

      const getProfiles = await Profile.find({})
        .skip(skip)
        .limit(limitNum)
        .select(selectedFields)
        .lean();

      if (!getProfiles.length) {
        return {
          success: false,
          status: 404,
          message: "Profiles not found",
        };
      }
      const parseSafeProfiles = validateAndFormatData(
        getProfiles,
        profileDto,
        "getAll"
      );
      if (parseSafeProfiles.success === false) return parseSafeProfiles;

      const countProfile = await this.countProfile();
      if (countProfile.count === 0) return countProfile;

      return {
        success: true,
        status: 200,
        message: "Get profiles successfully",
        data: getProfiles,
        count: countProfile.count,
      };
    }
  );

  // Count all profile
  countProfile = warpAsync(async (): Promise<responseHandler> => {
    const countProfiles = await Profile.countDocuments();
    if (countProfiles === 0) {
      return {
        success: false,
        status: 404,
        message: "Profiles not found",
      };
    }
    return {
      success: true,
      status: 200,
      message: "Count profile successfully",
      count: countProfiles,
    };
  });
}

export default ProfileService;
