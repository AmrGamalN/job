import { Schema, model } from "mongoose";
import { InterestDtoType } from "../../../dto/client/interest.dto";
const InterestSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    industries: [{ type: String }],
    hobbies: [{ type: String }],
    influencers: [{ type: String }],
    companies: [{ type: String }],
    groups: [{ type: String }],
  },
  { timestamps: true }
);

const Interest = model<InterestDtoType>("user_interests", InterestSchema);
export default Interest;
