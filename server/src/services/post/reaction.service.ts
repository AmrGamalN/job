import { Model } from "mongoose";
import { GraphQLResolveInfo } from "graphql";
import Reaction from "../../models/mongodb/post/reaction.model";
import Post from "../../models/mongodb/post/post.model";
import Comment from "../../models/mongodb/post/comment.model";
import {
  ReactionDto,
  ReactionAddDto,
  ReactionUpdateDto,
  ReactionAddDtoType,
  ReactionUpdateDtoType,
  ReactionDtoType,
} from "../../dto/post/reaction.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { generatePagination } from "../../utils/generatePagination.util";
import { ReactionType } from "../../types/post.types";
import { ServiceResponseType } from "../../types/response.type";

class ReactionService {
  private static instanceService: ReactionService;
  public static getInstance(): ReactionService {
    if (!ReactionService.instanceService) {
      ReactionService.instanceService = new ReactionService();
    }
    return ReactionService.instanceService;
  }

  addReaction = warpAsync(
    async (
      newReaction: ReactionAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data: newReaction,
        userDto: ReactionAddDto,
      });
      if (!validationResult.success) return validationResult;

      const isExistReaction = await Reaction.findOne({
        userId,
      });
      if (isExistReaction)
        return serviceResponse({
          statusText: "Conflict",
        });

      const addReaction = await Reaction.create({
        ...validationResult.data,
        userId,
        targetId: newReaction.targetId,
      });

      if (addReaction)
        await this.reactionMapping("add", addReaction, newReaction);

      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getReaction = warpAsync(
    async (targetType: string, _id: string): Promise<ServiceResponseType> => {
      return validateAndFormatData({
        data: await Reaction.findById({ _id, targetType }).lean(),
        userDto: ReactionDto,
      });
    }
  );

  getAllReactions = warpAsync(
    async (
      queries: ReactionType,
      info: GraphQLResolveInfo,
      targetId: string
    ): Promise<ServiceResponseType> => {
      return await generatePagination({
        model: Reaction,
        userDto: ReactionDto,
        totalCount: (await this.countReaction(queries, targetId)).count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        fieldSearch: targetId,
        graphqlInfo: info,
      });
    }
  );

  updateReaction = warpAsync(
    async (
      newReaction: ReactionUpdateDtoType,
      _id: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data: newReaction,
        userDto: ReactionUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateReaction = await Reaction.findOneAndUpdate(
        { _id, targetType: newReaction.targetType },
        {
          $set: {
            ...validationResult.data,
          },
        }
      );
      if (updateReaction)
        await this.reactionMapping("update", updateReaction, newReaction);

      return serviceResponse({
        statusText: "OK",
        data: updateReaction,
      });
    }
  );

  countReaction = warpAsync(
    async (
      queries: ReactionUpdateDtoType,
      targetId: string
    ): Promise<ServiceResponseType> => {
      return serviceResponse({
        count: await Reaction.countDocuments({ ...queries, targetId }),
      });
    }
  );

  deleteReaction = warpAsync(
    async (
      newReaction: ReactionUpdateDtoType,
      _id: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data: newReaction,
        userDto: ReactionUpdateDto,
        actionType: "delete",
      });
      if (!validationResult.success) return validationResult;

      const deleteReaction = await Reaction.findOneAndDelete({
        _id,
        targetType: newReaction.targetType,
      }).lean();

      if (deleteReaction)
        await this.reactionMapping("delete", deleteReaction, newReaction);
      return serviceResponse({
        deletedCount: deleteReaction ? 1 : 0,
      });
    }
  );

  private async reactionMapping(
    key: string,
    oldReaction: ReactionDtoType,
    newReaction: ReactionUpdateDtoType
  ) {
    const update: any = { $inc: {} };
    const reactionMap: Record<string, number> = {
      like: 0,
      love: 1,
      haha: 2,
      wow: 3,
      sad: 4,
      angry: 5,
    };

    const oldIndex = reactionMap[oldReaction.reactionType];
    const newIndex = reactionMap[newReaction.reactionType];
    if (newIndex === oldIndex && key !== "add") return;

    const reactionStatusMapping: Record<string, any> = {
      add: () => {
        update.$inc[`reactionCount.${newIndex}`] = 1;
        update.$addToSet = { id: oldReaction._id };
      },
      update: () => {
        if (oldIndex != newIndex) {
          update.$inc[`reactionCount.${oldIndex}`] = -1;
          update.$inc[`reactionCount.${newIndex}`] = 1;
        }
      },
      delete: () => {
        update.$inc[`reactionCount.${oldIndex}`] = -1;
        update.$pull = { id: oldReaction._id };
      },
    };

    const model = oldReaction.targetType === "post" ? Post : Comment;
    await (model as Model<any>).updateOne(
      { _id: oldReaction.targetId },
      reactionStatusMapping[key]
    );
  }
}

export default ReactionService;
