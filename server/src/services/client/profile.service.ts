import Profile from "../../models/mongodb/client/profile.model";
import {
  ProfileAdminDto,
  ProfileUserDto,
  ProfileDtoType,
  ProfileUpdateDto,
  ProfileUpdateDtoType,
} from "../../dto/client/profile.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { generatePagination } from "../../utils/generatePagination.util";
import { UserRoleType } from "../../types/role.type";
import { ServiceResponseType } from "../../types/response.type";
import { GraphQLResolveInfo } from "graphql";

class ProfileService {
  private static instanceService: ProfileService;
  public static getInstance(): ProfileService {
    if (!ProfileService.instanceService) {
      ProfileService.instanceService = new ProfileService();
    }
    return ProfileService.instanceService;
  }

  updateProfile = warpAsync(
    async (data: ProfileUpdateDtoType): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: ProfileUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateProfile = await Profile.findOneAndUpdate(
        { userId: data.userId },
        {
          $set: {
            ...data,
          },
        },
        {
          new: true,
        }
      );
      return serviceResponse({
        data: updateProfile,
      });
    }
  );

  getProfileByLink = warpAsync(
    async (
      data: ProfileDtoType,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      return validateAndFormatData({
        data,
        userDto: ProfileUserDto,
        adminDto: ProfileAdminDto,
        viewerRole,
      });
    }
  );

  getProfile = warpAsync(
    async (
      data: ProfileDtoType,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      return validateAndFormatData({
        data,
        userDto: ProfileUserDto,
        adminDto: ProfileAdminDto,
        viewerRole,
      });
    }
  );

  getAllProfiles = warpAsync(
    async (
      queries: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      return await generatePagination({
        model: Profile,
        userDto: ProfileUserDto,
        adminDto: ProfileAdminDto,
        viewerRole,
        totalCount: (await this.countProfile()).count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        graphqlInfo: info,
      });
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
