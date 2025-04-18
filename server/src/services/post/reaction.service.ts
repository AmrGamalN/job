import {
  PostReaction,
  CommentReaction,
} from "../../models/mongodb/post/reaction.model";
import Post from "../../models/mongodb/post/post.model";
import Comment from "../../models/mongodb/post/comment.model";
import { Model } from "mongoose";
import {
  ReactionDto,
  ReactionAddDto,
  ReactionUpdateDto,
} from "../../dto/post/reaction.dto";
import {
  OK,
  NotFound,
  BadRequest,
  Conflict,
  responseHandler,
} from "../../utils/responseHandler";
import { warpAsync } from "../../utils/warpAsync";
import { validateAndFormatData } from "../../utils/validateAndFormatData";
import { GraphQLResolveInfo } from "graphql";
import { PaginationGraphQl } from "../../utils/pagination";

class ReactionService {
  private static instanceService: ReactionService;
  public static getInstance(): ReactionService {
    if (!ReactionService.instanceService) {
      ReactionService.instanceService = new ReactionService();
    }
    return ReactionService.instanceService;
  }

  // Add reaction to post or comment
  addReaction = warpAsync(
    async (
      query: any,
      id: string,
      userId: string
    ): Promise<responseHandler> => {
      const reactionContext = this.resolveReactionModel(query);
      const parseSafe = validateAndFormatData(
        { reactionType: reactionContext.reactionType },
        ReactionAddDto
      );
      if (!parseSafe.success) return parseSafe;

      const isExistReaction = await reactionContext.modelReaction.findOne({
        userId,
      });
      if (isExistReaction) return Conflict("Reaction");

      const reaction = await reactionContext.modelReaction.create({
        ...parseSafe.data,
        userId,
        [reactionContext.id]: id,
      });
      await this.updatePostReaction(reactionContext, reaction, "add");
      return OK("Add reaction", parseSafe.data);
    }
  );

  getReaction = warpAsync(
    async (query: any, reactionId: string): Promise<responseHandler> => {
      const reactionContext = this.resolveReactionModel(query);
      const getReaction = await reactionContext.modelReaction
        .findOne({ _id: reactionId })
        .lean();
      console.log(getReaction);
      if (!getReaction) NotFound("Reaction");
      const parseSafe = validateAndFormatData(getReaction, ReactionDto);
      if (!parseSafe.success) return parseSafe;
      return OK("Get reaction", parseSafe.data);
    }
  );

  getAllReactions = warpAsync(
    async (
      args: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo
    ): Promise<responseHandler> => {
      const reactionContext = this.resolveReactionModel(info.fieldName);
      const getReactions = await PaginationGraphQl(
        args.page,
        args.limit,
        info,
        reactionContext.modelReaction
      );
      if (!getReactions.length) return NotFound("Reactions");

      const parseSafe = validateAndFormatData(
        getReactions,
        ReactionDto,
        "getAll"
      );
      if (!parseSafe.success) return parseSafe;

      const countReaction = await this.countReaction();
      if (!countReaction.count) return countReaction;
      return OK("Get reactions", parseSafe.data, countReaction.count);
    }
  );

  updateReaction = warpAsync(
    async (query: any, reactionId: string): Promise<responseHandler> => {
      if (Object.keys(query).length === 0) return BadRequest();
      const reactionContext = this.resolveReactionModel(query);
      const parseSafe = validateAndFormatData(
        { reactionType: reactionContext.reactionType },
        ReactionUpdateDto
      );
      if (!parseSafe.success) return parseSafe;

      const updateReaction = await reactionContext.modelReaction
        .findOneAndUpdate(
          { _id: reactionId },
          {
            $set: {
              ...parseSafe.data,
            },
          }
        )
        .lean();
      if (!updateReaction) return NotFound("Reaction");

      await this.updatePostReaction(reactionContext, updateReaction, "update");
      return OK("Update reaction", updateReaction);
    }
  );

  countReaction = warpAsync(
    async (query: string, id: string): Promise<responseHandler> => {
      const reactionContext = this.resolveReactionModel(query);
      console.log(reactionContext);
      const countReactions = await reactionContext.modelReaction.countDocuments(
        { [reactionContext.id]: id }
      );
      if (!countReactions) return NotFound("Reaction");
      return OK("Count reaction", null, countReactions);
    }
  );

  deleteReaction = warpAsync(
    async (query: string, reactionId: string): Promise<responseHandler> => {
      const reactionContext = this.resolveReactionModel(query);
      const parseSafe = validateAndFormatData(
        { reactionType: reactionContext.reactionType },
        ReactionUpdateDto
      );
      if (!parseSafe.success) return parseSafe;

      const deleteReaction = await reactionContext.modelReaction
        .findOneAndDelete({
          _id: reactionId,
        })
        .lean();
      if (!deleteReaction) return NotFound("Reaction");

      await this.updatePostReaction(reactionContext, deleteReaction, "delete");
      return OK("Delete reaction");
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

    const idValue =
      newReaction.id === "postId" ? oldReaction.postId : oldReaction.commentId;
    const newIndex = reactionMap[newReaction.reactionType];
    const oldIndex = reactionMap[oldReaction.reactionType];
    const update: any = { $inc: {} };

    if (newIndex === oldIndex && action !== "add") return;
    if (action === "update" && newIndex !== oldIndex) {
      update.$inc[`reactionCount.${oldIndex}`] = -1;
      update.$inc[`reactionCount.${newIndex}`] = 1;
    } else if (action === "add") {
      update.$inc[`reactionCount.${newIndex}`] = 1;
      update.$addToSet = { reactionId: oldReaction._id };
    } else if (action === "delete") {
      update.$inc[`reactionCount.${oldIndex}`] = -1;
      update.$pull = { reactionId: oldReaction._id };
    }
    await newReaction.model.updateOne({ _id: idValue }, update);
  }

  private resolveReactionModel(query: any): {
    modelReaction: Model<any>;
    model: Model<any>;
    id: "postId" | "commentId";
    reactionType: string;
  } {
    return Object.keys(query)[0] === "post" ||
      Object.values(query)[0] === "post"
      ? {
          modelReaction: PostReaction,
          id: "postId",
          model: Post,
          reactionType: query.post,
        }
      : {
          modelReaction: CommentReaction,
          id: "commentId",
          model: Comment,
          reactionType: query.comment,
        };
  }
}

export default ReactionService;
