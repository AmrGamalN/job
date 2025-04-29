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

const postReactionSchema = new Schema(
  {
    userId: { type: String, ref: "user_users", required: true },
    reactionType: {
      type: String,
      enum: Object.values(ReactionType),
      default: ReactionType.LIKE,
      required: true,
    },
    id: { type: Schema.Types.ObjectId, ref: "post_posts", required: true },
  },
  { timestamps: true }
);

const commentReactionSchema = new Schema(
  {
    userId: { type: String, ref: "user_users", required: true },
    id: { type: Schema.Types.ObjectId, ref: "post_comments", required: true },
    reactionType: {
      type: String,
      enum: Object.values(ReactionType),
      default: ReactionType.LIKE,
      required: true,
    },
  },
  { timestamps: true }
);

postReactionSchema.index({ userId: 1, id: 1 }, { unique: true });
commentReactionSchema.index({ userId: 1, id: 1 }, { unique: true });
export const PostReaction = model<ReactionDtoType>(
  "post_postReactions",
  postReactionSchema
);
export const CommentReaction = model<ReactionDtoType>(
  "post_commentReactions",
  commentReactionSchema
);
