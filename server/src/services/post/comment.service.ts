import Comment from "../../models/mongodb/post/comment.model";
import {
  commentDto,
  commentAddDto,
  commentUpdateDto,
  commentAddDtoType,
  commentUpdateDtoType,
} from "../../dto/post/comment.dto";
import {
  OK,
  NotFound,
  BadRequest,
  responseHandler,
} from "../../utils/responseHandler";
import { warpAsync } from "../../utils/warpAsync";
import { validateAndFormatData } from "../../utils/validateAndFormatData";
import { GraphQLResolveInfo } from "graphql";
import Post from "../../models/mongodb/post/post.model";
import { PaginationGraphQl } from "../../utils/pagination";

class CommentService {
  private static instanceService: CommentService;
  public static getInstance(): CommentService {
    if (!CommentService.instanceService) {
      CommentService.instanceService = new CommentService();
    }
    return CommentService.instanceService;
  }

  addComment = warpAsync(
    async (
      data: commentAddDtoType,
      postId: string,
      userId: string
    ): Promise<responseHandler> => {
      const parseSafe = validateAndFormatData(data, commentAddDto);
      const comment = await Comment.create({
        ...parseSafe.data,
        postId,
        userId,
      });
      await Post.updateOne(
        { _id: postId },
        {
          $addToSet: {
            commentId: comment._id,
          },
          $inc: {
            commentCount: 1,
          },
        }
      );
      return OK("Add comment", parseSafe.data);
    }
  );

  getComment = warpAsync(async (query: object): Promise<responseHandler> => {
    const getComment = await Comment.findOne(query).lean();
    if (!getComment) return NotFound("Comment");
    const parseSafe = validateAndFormatData(getComment, commentDto);
    if (!parseSafe.success) return parseSafe;
    return OK("Get comment", parseSafe.data);
  });

  getAllComments = warpAsync(
    async (
      args: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo
    ): Promise<responseHandler> => {
      const getComments = await PaginationGraphQl(
        args.page,
        args.limit,
        info,
        Post
      );
      if (!getComments.length) return NotFound("Comments");

      const parseSafe = validateAndFormatData(
        getComments,
        commentDto,
        "getAll"
      );
      if (!parseSafe.success) return parseSafe;

      const countComment = await this.countComment();
      if (!countComment.count) return countComment;
      return OK("Get comments", parseSafe.data, countComment.count);
    }
  );

  updateComment = warpAsync(
    async (
      data: commentUpdateDtoType,
      query: object
    ): Promise<responseHandler> => {
      if (Object.keys(data).length === 0) return BadRequest();

      const parseSafe = validateAndFormatData(data, commentUpdateDto);
      if (!parseSafe.success) return parseSafe;

      const updateComment = await Comment.updateOne(
        query,
        {
          $set: {
            ...parseSafe.data,
            isEdited: true,
          },
        },
        {
          new: true,
        }
      );
      if (!updateComment.matchedCount) return NotFound("Comment");
      return OK("Update comment", updateComment);
    }
  );

  countComment = warpAsync(async (postId: string): Promise<responseHandler> => {
    const countComments = await Comment.countDocuments({ postId });
    if (countComments === 0) return NotFound("Comment");
    return OK("Count comment", null, countComments);
  });

  deleteComment = warpAsync(async (query: object): Promise<responseHandler> => {
    const deleteComment = await Comment.findOneAndDelete(query)
      .lean()
      .select({ _id: 1, postId: 1 });
    if (!deleteComment) return NotFound("Comment");

    await Post.updateOne(
      { _id: deleteComment.postId },
      {
        $pull: {
          commentId: deleteComment._id,
        },
        $inc: {
          commentCount: -1,
        },
      }
    );
    return OK("Delete post");
  });
}

export default CommentService;
