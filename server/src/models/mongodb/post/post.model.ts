import mongoose, { Schema } from "mongoose";
import { postDtoType } from "../../../dto/post/post.dto";

const PostSchema = new Schema(
  {
    userId: { type: String, ref: "users", required: true },
    commentId: [
      {
        type: Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
    postId: [
      {
        type: Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
    mentions: [],
    prefixS3: {
      type: String,
      trim: true,
      default: "",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video", "document"],
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
    shares: {
      type: Number,
      default: 0,
    },
    watch: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ["public", "connections", "private"],
      default: "public",
    },
    hashtags: [
      {
        type: String,
        trim: true,
      },
    ],
    reactionCount: {
      type: [Number],
      default: [0, 0, 0, 0, 0, 0], // LIKE HAHA WOW SAD ANGRY
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
PostSchema.index({ id: 1 });
PostSchema.index({ hashtags: 1 });
const Post = mongoose.model<postDtoType>("posts", PostSchema);
export default Post;
