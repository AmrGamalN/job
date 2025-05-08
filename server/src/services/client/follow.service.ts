import Follow from "../../models/mongodb/client/follow.model";
import Activity from "../../models/mongodb/Analytics/activity.model";
import {
  FollowAddDto,
  FollowUpdateDto,
  FollowAddDtoType,
  FollowUpdateDtoType,
  FollowAdminDto,
  FollowUserDto,
  FollowDtoType,
} from "../../dto/client/follow.dto";
import { generatePagination } from "../../utils/generatePagination.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { generateFilters } from "../../utils/generateFilters&Sort.util";
import { ServiceResponseType } from "../../types/response.type";
import { FollowFiltersType } from "../../types/client.type";
import { UserRequestType } from "../../types/request.type";
import { UserRoleType } from "../../types/role.type";

class FollowService {
  private static instanceService: FollowService;
  public static getInstance(): FollowService {
    if (!FollowService.instanceService) {
      FollowService.instanceService = new FollowService();
    }
    return FollowService.instanceService;
  }

  addFollow = warpAsync(
    async (
      data: FollowAddDtoType,
      user: UserRequestType
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: FollowAddDto,
      });
      if (!validationResult.success) return validationResult;

      if (data.followingId === user.userId)
        return serviceResponse({
          statusText: "Conflict",
          message: "You cannot follow yourself.",
        });

      const existingFollow = await Follow.exists({
        followerId: user.userId,
        followingId: data.followingId,
      }).lean();
      if (existingFollow) {
        return serviceResponse({
          statusText: "Conflict",
          message: "You are already following this user.",
        });
      }
      const createFollow = await Follow.create({
        ...data,
        followerId: user.userId,
        nameFollower: user.name,
        followStatus: "follow",
      });

      if (createFollow) await this.updateActivityFollow(createFollow, "follow");
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getFollow = warpAsync(
    async (
      _id: string,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      return validateAndFormatData({
        data: await Follow.findById({ _id }).lean(),
        userDto: FollowUserDto,
        adminDto: FollowUserDto,
        viewerRole,
      });
    }
  );

  getAllFollows = warpAsync(
    async (
      queries: FollowFiltersType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const followDirection: any = {
        $or: [{ followerId: userId }, { followingId: userId }],
      };
      const filters = generateFilters<FollowFiltersType>(queries);
      const count = await this.countFollow(userId, filters, true);
      return await generatePagination({
        model: Follow,
        userDto: FollowAdminDto,
        totalCount: count.count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        fieldSearch: { ...followDirection, ...filters },
      });
    }
  );

  countFollow = warpAsync(
    async (
      userId: string,
      queries: FollowFiltersType,
      filtered?: boolean
    ): Promise<ServiceResponseType> => {
      const followDirection: any = {
        $or: [{ followerId: userId }, { followingId: userId }],
      };
      const filters = filtered
        ? queries
        : generateFilters<FollowFiltersType>(queries);
      console.log(filters);
      return serviceResponse({
        count: await Follow.countDocuments({
          ...followDirection,
          ...filters,
        }),
      });
    }
  );

  deleteFollow = warpAsync(
    async (_id: string): Promise<ServiceResponseType> => {
      const deleteFollow = await Follow.findByIdAndDelete({ _id });
      if (deleteFollow)
        await this.updateActivityFollow(deleteFollow, "unfollow");
      return serviceResponse({
        deletedCount: deleteFollow ? 1 : 0,
      });
    }
  );

  private updateActivityFollow = async (
    data: FollowDtoType,
    status: string
  ) => {
    let updateActivity: any;
    if (status === "follow") {
      updateActivity = [
        {
          updateOne: {
            filter: { userId: data.followerId },
            update: { $inc: { following: 1 } },
          },
        },
        {
          updateOne: {
            filter: { userId: data.followingId },
            update: { $inc: { followers: 1 } },
          },
        },
      ];
    }
    if (status === "unfollow") {
      updateActivity = [
        {
          updateOne: {
            filter: { userId: data.followerId },
            update: { $inc: { following: -1 } },
          },
        },
        {
          updateOne: {
            filter: { userId: data.followingId },
            update: { $inc: { followers: -1 } },
          },
        },
      ];
    }
    await Activity.bulkWrite(updateActivity);
  };
}

export default FollowService;
