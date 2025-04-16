import { Schema, model } from "mongoose";
import { InterestDtoType } from "../../../dto/profiles/interest.dto";
const InterestSchema = new Schema(
  {
    userId: { type: String, ref: "users", required: true, unique: true },
    industries: [{ type: String }],
    hobbies: [{ type: String }],
    influencers: [{ type: String }],
    companies: [{ type: String }],
    groups: [{ type: String }],
  },
  { timestamps: true }
);

const Interest = model<InterestDtoType>("Interest", InterestSchema);
export default Interest;
