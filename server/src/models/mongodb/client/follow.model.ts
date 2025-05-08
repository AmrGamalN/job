import { Schema, model } from "mongoose";
import { FollowDtoType } from "../../../dto/client/follow.dto";
const FollowSchema = new Schema(
  {
    followerId: {
      type: String,
      required: true,
    },
    followingId: {
      type: String,
      required: true,
    },
    nameFollower: {
      type: String,
      default: "",
    },
    nameFollowing: {
      type: String,
      default: "",
    },
    followerType: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    followingType: {
      type: String,
      enum: ["user", "company", "school"],
      required: true,
    },
    followStatus: {
      type: String,
      enum: ["follow", "unfollow"],
    },
  },
  { timestamps: true }
);

FollowSchema.index(
  { followerId: 1, followingId: 1, actorType: 1 },
  { unique: true }
);
const Follow = model<FollowDtoType>("user_follows", FollowSchema);
export default Follow;
