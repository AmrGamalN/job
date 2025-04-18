import { Schema, model } from "mongoose";
import { ReactionDtoType } from "../../../dto/post/reaction.dto";

enum ReactionType {
  LIKE = "like",
  LOVE = "love",
  HAHA = "haha",
  WOW = "wow",
  SAD = "sad",
  ANGRY = "angry",
}

const baseFields = {};

const postReactionSchema = new Schema(
  {
    userId: { type: String, ref: "users", required: true },
    reactionType: {
      type: String,
      enum: Object.values(ReactionType),
      default: ReactionType.LIKE,
      required: true,
    },
    postId: { type: Schema.Types.ObjectId, ref: "posts", required: true },
  },
  { timestamps: true }
);

const commentReactionSchema = new Schema(
  {
    userId: { type: String, ref: "users", required: true },
    commentId: { type: Schema.Types.ObjectId, ref: "comments", required: true },
    reactionType: {
      type: String,
      enum: Object.values(ReactionType),
      default: ReactionType.LIKE,
      required: true,
    },
  },
  { timestamps: true }
);

postReactionSchema.index({ userId: 1, postId: 1 }, { unique: true });
commentReactionSchema.index({ userId: 1, commentId: 1 }, { unique: true });
export const PostReaction = model<ReactionDtoType>(
  "post_reactions",
  postReactionSchema
);
export const CommentReaction = model<ReactionDtoType>(
  "comment_reactions",
  commentReactionSchema
);
