import User from "../../models/mongodb/profiles/user.model";
import {
  UserDto,
  UserUpdateDto,
  UserUpdateDtoType,
} from "../../dto/profiles/user.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler, serviceResponse } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";
import { GraphQLResolveInfo } from "graphql";
import { PaginationGraphQl } from "../../utils/pagination";
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
    ): Promise<responseHandler> => {
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
    ): Promise<responseHandler> => {
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
    ): Promise<responseHandler> => {
      const count = await this.countUser();
      return await PaginationGraphQl(
        User,
        UserDto,
        count.count ?? 0,
        args,
        info
      );
    }
  );

  countUser = warpAsync(async (): Promise<responseHandler> => {
    return serviceResponse({
      count: await User.countDocuments(),
    });
  });
}

export default UserService;
