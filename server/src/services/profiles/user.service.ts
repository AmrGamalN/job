import User from "../../models/mongodb/profiles/user.model";
import {
  UserDto,
  UserUpdateDto,
  UserUpdateDtoType,
} from "../../dto/profiles/user.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { ServiceResponseType } from "../../types/response.type";
import { validateAndFormatData } from "../../utils/validateData.util";
import { GraphQLResolveInfo } from "graphql";
import { paginate } from "../../utils/pagination.util";
const graphqlFields = require("graphql-fields");

class UserService {
  private static instanceService: UserService;
  public static getInstance(): UserService {
    if (!UserService.instanceService) {
      UserService.instanceService = new UserService();
    }
    return UserService.instanceService;
  }

  updateUser = warpAsync(
    async (
      UserData: UserUpdateDtoType,
      query: object
    ): Promise<ServiceResponseType> => {
      const parseSafe = validateAndFormatData(UserData, UserUpdateDto);
      if (!parseSafe.success) return parseSafe;

      const updateUser = await User.findOneAndUpdate(
        query,
        {
          $set: {
            ...UserData,
          },
        },
        {
          new: true,
        }
      ).lean();
      return serviceResponse({
        data: updateUser,
      });
    }
  );

  getUser = warpAsync(
    async (
      args: {
        userId: string;
      },
      info: any
    ): Promise<ServiceResponseType> => {
      const selectedFields = Object.keys(graphqlFields(info).data || {}).join(
        " "
      );
      const getUser = await User.findOne({ userId: args })
        .select(selectedFields)
        .lean();

      const parseSafe = validateAndFormatData(getUser, UserDto);
      if (!parseSafe.success) return parseSafe;
      return serviceResponse({
        data: parseSafe.data,
      });
    }
  );

  getAllUsers = warpAsync(
    async (
      args: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo
    ): Promise<ServiceResponseType> => {
      const count = await this.countUser();
      return await paginate(User, UserDto, count.count ?? 0, args, info);
    }
  );

  countUser = warpAsync(async (): Promise<ServiceResponseType> => {
    return serviceResponse({
      count: await User.countDocuments(),
    });
  });
}

export default UserService;
