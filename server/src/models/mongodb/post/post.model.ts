import mongoose, { Schema } from "mongoose";
import { postDtoType } from "../../../dto/post/post.dto";

const PostSchema = new Schema(
  {
    actorId: { type: String, ref: "user_users", required: true },
    actorType: {
      type: String,
      enum: ["user", "company", "school", "group", "post", "job"],
      required: true,
    },
    commentId: [
      {
        type: Schema.Types.ObjectId,
        ref: "post_comments",
      },
    ],
    postId: [
      {
        type: Schema.Types.ObjectId,
        ref: "post_posts",
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
    postLink: {
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
const Post = mongoose.model<postDtoType>("post_posts", PostSchema);
export default Post;
