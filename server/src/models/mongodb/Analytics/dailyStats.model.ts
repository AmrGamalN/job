import { Schema, model } from "mongoose";

const DailyStatsSchema = new Schema(
  {
    userId: { type: String, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Activity = model("DailyState", DailyStatsSchema);
export default Activity;
