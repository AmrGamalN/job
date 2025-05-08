import { Schema, model } from "mongoose";

const ActivitySchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    connections: {
      pending: {
        type: Number,
        default: 0,
      },
      accepted: {
        type: Number,
        default: 0,
      },
      blocked: {
        type: Number,
        default: 0,
      },
    },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    viewers: { type: Number, default: 0 },
    totalGroups: { type: Number, default: 0 },
    totalEvents: { type: Number, default: 0 },
    totalPages: { type: Number, default: 0 },
    totalPosts: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    totalShares: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 },
    weeklyActiveHours: { type: Number, default: 0 },
    monthlyActiveHours: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Activity = model("Activity", ActivitySchema);
export default Activity;
