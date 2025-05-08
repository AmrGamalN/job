import User from "../../models/mongodb/client/user.model";
import {
  AdminDto,
  UserDto,
  UserDtoType,
  UserUpdateDto,
  UserUpdateDtoType,
} from "../../dto/client/user.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { ServiceResponseType } from "../../types/response.type";
import { validateAndFormatData } from "../../utils/validateData.util";
import { generatePagination } from "../../utils/generatePagination.util";
import { UserRoleType } from "../../types/role.type";
import { GraphQLResolveInfo } from "graphql";

class UserService {
  private static instanceService: UserService;
  public static getInstance(): UserService {
    if (!UserService.instanceService) {
      UserService.instanceService = new UserService();
    }
    return UserService.instanceService;
  }

  updateUser = warpAsync(
    async (data: UserUpdateDtoType): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: UserUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateUser = await User.updateOne(
        { userId: data.userId },
        {
          $set: {
            ...data,
          },
        }
      );
      return serviceResponse({
        data: updateUser.modifiedCount,
      });
    }
  );

  getUser = warpAsync(
    async (
      data: UserDtoType,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      return validateAndFormatData({
        data,
        userDto: UserDto,
        adminDto: AdminDto,
        viewerRole,
      });
    }
  );

  getAllUsers = warpAsync(
    async (
      queries: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      return await generatePagination({
        model: User,
        userDto: UserDto,
        adminDto: AdminDto,
        viewerRole,
        totalCount: (await this.countUser()).count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        graphqlInfo: info,
      });
    }
  );

  countUser = warpAsync(async (): Promise<ServiceResponseType> => {
    return serviceResponse({
      count: await User.countDocuments(),
    });
  });
}

export default UserService;
