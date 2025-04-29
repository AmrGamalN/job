import mongoose, { Schema } from "mongoose";
import { commentDtoType } from "../../../dto/post/comment.dto";
const CommentSchema = new Schema(
  {
    userId: { type: String, ref: "user_users", required: true },
    id: {
      type: Schema.Types.ObjectId,
      ref: "post_posts",
      required: true,
    },
    commentId: [
      {
        type: Schema.Types.ObjectId,
        ref: "post_comments",
      },
    ],
    reactionId: [
      {
        type: Schema.Types.ObjectId,
        ref: "post_commentReactions",
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

CommentSchema.index({ id: 1, createdAt: -1 });
CommentSchema.index({ userId: 1 });
const Comment = mongoose.model<commentDtoType>("post_comments", CommentSchema);
export default Comment;
