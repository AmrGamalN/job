import User from "../../models/mongodb/profiles/user.model";
import {
  UserDto,
  UserUpdateDto,
  UserUpdateDtoType,
} from "../../dto/profiles/user.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";
import { GraphQLResolveInfo } from "graphql";
const graphqlFields = require("graphql-fields");

class UserService {
  private static instanceService: UserService;
  public static getInstance(): UserService {
    if (!UserService.instanceService) {
      UserService.instanceService = new UserService();
    }
    return UserService.instanceService;
  }

  // Update User
  updateUser = warpAsync(
    async (
      UserData: UserUpdateDtoType,
      query: object,
    ): Promise<responseHandler> => {
      if (Object.keys(UserData).length === 0) {
        return {
          success: false,
          status: 400,
          message: "No data provided for update",
        };
      }

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

      if (!updateUser) {
        return {
          success: false,
          status: 404,
          message: "User not found",
        };
      }

      return {
        success: true,
        status: 200,
        message: "Update User successfully",
        data: updateUser,
      };
    }
  );

  // Get user model with profile model with security model by using GraphQl to select any field he need
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

      if (!getUser) {
        return {
          success: false,
          status: 404,
          message: "User not found",
        };
      }

      const parseSafeUser = validateAndFormatData(getUser, UserDto);
      if (!parseSafeUser.success) return parseSafeUser;

      return {
        success: true,
        status: 200,
        message: "Get user successfully",
        data: getUser,
      };
    }
  );
    
  // Get all user model by using GraphQl to select any field is need
  getAllUsers = warpAsync(
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

      const getUsers = await User.find({})
        .skip(skip)
        .limit(limitNum)
        .select(selectedFields)
        .lean();
      if (!getUsers.length) {
        return {
          success: false,
          status: 404,
          message: "Users not found",
        };
      }

      const parseSafeUsers = validateAndFormatData(getUsers, UserDto, "getAll");
      if (parseSafeUsers.success === false) return parseSafeUsers;

      const countUsers = await this.countUser();
      if (countUsers.count === 0) return countUsers;

      return {
        success: true,
        status: 200,
        message: "Get users successfully",
        data: getUsers,
        count: countUsers.count,
      };
    }
  );

  // Count all User
  countUser = warpAsync(async (): Promise<responseHandler> => {
    const countUsers = await User.countDocuments();
    if (countUsers === 0) {
      return {
        success: false,
        status: 404,
        message: "Users not found",
      };
    }
    return {
      success: true,
      status: 200,
      message: "Count User successfully",
      count: countUsers,
    };
  });
}

export default UserService;
