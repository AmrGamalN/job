import { Schema, model } from "mongoose";
import { InterestDtoType } from "../../../dto/profiles/interest.dto";
const InterestSchema = new Schema(
  {
    actorId: {
      type: String,
      refPath: "ownerModel",
      required: true,
      unique: true,
    },
    ownerModel: {
      type: String,
      required: true,
      enum: ["user", "company", "school"],
      default: "user",
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
