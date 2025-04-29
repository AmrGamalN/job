import { Model } from "mongoose";
import { GraphQLResolveInfo } from "graphql";
import {
  PostReaction,
  CommentReaction,
} from "../../models/mongodb/post/reaction.model";
import Post from "../../models/mongodb/post/post.model";
import Comment from "../../models/mongodb/post/comment.model";
import {
  ReactionDto,
  ReactionAddDto,
  ReactionUpdateDto,
} from "../../dto/post/reaction.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { paginate } from "../../utils/pagination.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
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
      query: any,
      id: string,
      userId: string
    ): Promise<ServiceResponseType> => {
      const reactionContext = this.resolveReactionModel(query);
      const validationResult = validateAndFormatData(
        { reactionType: reactionContext.reactionType },
        ReactionAddDto
      );
      if (!validationResult.success) return validationResult;

      const isExistReaction = await reactionContext.modelReaction.findOne({
        userId,
      });
      if (isExistReaction)
        return serviceResponse({
          statusText: "Conflict",
        });

      const reaction = await reactionContext.modelReaction.create({
        ...validationResult.data,
        userId,
        [reactionContext.id]: id,
      });
      await this.updatePostReaction(reactionContext, reaction, "add");
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getReaction = warpAsync(
    async (query: any, id: string): Promise<ServiceResponseType> => {
      const reactionContext = this.resolveReactionModel(query);
      const getReaction = await reactionContext.modelReaction
        .findOne({ _id: id })
        .lean();
      return validateAndFormatData(getReaction, ReactionDto);
    }
  );

  getAllReactions = warpAsync(
    async (
      args: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo
    ): Promise<ServiceResponseType> => {
      const reactionContext = this.resolveReactionModel(info.fieldName);
      const count = await this.countReaction();
      return await paginate(
        reactionContext.modelReaction,
        ReactionDto,
        count.count ?? 0,
        args,
        info
      );
    }
  );

  updateReaction = warpAsync(
    async (query: any, id: string): Promise<ServiceResponseType> => {
      const reactionContext = this.resolveReactionModel(query);
      const validationResult = validateAndFormatData(
        { reactionType: reactionContext.reactionType },
        ReactionUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const updateReaction = await reactionContext.modelReaction
        .findOneAndUpdate(
          { _id: id },
          {
            $set: {
              ...validationResult.data,
            },
          }
        )
        .lean();
      if (!updateReaction)
        return serviceResponse({
          statusText: "NotFound",
        });

      await this.updatePostReaction(reactionContext, updateReaction, "update");
      return serviceResponse({
        statusText: "OK",
        message: "Update",
        data: validationResult.data,
      });
    }
  );

  countReaction = warpAsync(
    async (query: string, id: string): Promise<ServiceResponseType> => {
      const reactionContext = this.resolveReactionModel(query);
      const countReactions = await reactionContext.modelReaction.countDocuments(
        { [reactionContext.id]: id }
      );
      if (!countReactions)
        return serviceResponse({
          statusText: "NotFound",
        });
      return serviceResponse({
        statusText: "OK",
        message: "Delete",
        count: countReactions,
      });
    }
  );

  deleteReaction = warpAsync(
    async (query: string, id: string): Promise<ServiceResponseType> => {
      const reactionContext = this.resolveReactionModel(query);
      const validationResult = validateAndFormatData(
        { reactionType: reactionContext.reactionType },
        ReactionUpdateDto
      );
      if (!validationResult.success) return validationResult;

      const deleteReaction = await reactionContext.modelReaction
        .findOneAndDelete({
          _id: id,
        })
        .lean();
      if (!deleteReaction)
        return serviceResponse({
          statusText: "NotFound",
        });

      await this.updatePostReaction(reactionContext, deleteReaction, "delete");
      return serviceResponse({
        statusText: "OK",
        message: "Delete",
      });
    }
  );

  private async updatePostReaction(
    newReaction: any,
    oldReaction: any,
    action: "add" | "delete" | "update"
  ) {
    const reactionMap: Record<string, number> = {
      like: 0,
      love: 1,
      haha: 2,
      wow: 3,
      sad: 4,
      angry: 5,
    };

    const idValue = newReaction.id === "id" ? oldReaction.id : oldReaction.id;
    const newIndex = reactionMap[newReaction.reactionType];
    const oldIndex = reactionMap[oldReaction.reactionType];
    const update: any = { $inc: {} };

    if (newIndex === oldIndex && action !== "add") return;
    if (action === "update" && newIndex !== oldIndex) {
      update.$inc[`reactionCount.${oldIndex}`] = -1;
      update.$inc[`reactionCount.${newIndex}`] = 1;
    } else if (action === "add") {
      update.$inc[`reactionCount.${newIndex}`] = 1;
      update.$addToSet = { id: oldReaction._id };
    } else if (action === "delete") {
      update.$inc[`reactionCount.${oldIndex}`] = -1;
      update.$pull = { id: oldReaction._id };
    }
    await newReaction.model.updateOne({ _id: idValue }, update);
  }

  private resolveReactionModel(query: any): {
    modelReaction: Model<any>;
    model: Model<any>;
    id: "id" | "id";
    reactionType: string;
  } {
    return Object.keys(query)[0] === "post" ||
      Object.values(query)[0] === "post"
      ? {
          modelReaction: PostReaction,
          id: "id",
          model: Post,
          reactionType: query.post,
        }
      : {
          modelReaction: CommentReaction,
          id: "id",
          model: Comment,
          reactionType: query.comment,
        };
  }
}

export default ReactionService;
