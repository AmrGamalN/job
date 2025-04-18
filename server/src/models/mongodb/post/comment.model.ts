import mongoose, { Schema } from "mongoose";
import { commentDtoType } from "../../../dto/post/comment.dto";

enum ReactionType {
  LIKE = "like",
  LOVE = "love",
  HAHA = "haha",
  WOW = "wow",
  SAD = "sad",
  ANGRY = "angry",
}

const CommentSchema = new Schema(
  {
    userId: { type: String, ref: "users", required: true },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    commentId: [
      {
        type: Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
    reactionId: [
      {
        type: Schema.Types.ObjectId,
        ref: "comment_reactions",
      },
    ],
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        key: {
          type: String,
          required: true,
        },
        _id: false,
      },
    ],
    reactionCount: {
      type: [Number],
      default: [0, 0, 0, 0, 0, 0],
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ userId: 1 });
const Comment = mongoose.model<commentDtoType>("Comment", CommentSchema);
export default Comment;
