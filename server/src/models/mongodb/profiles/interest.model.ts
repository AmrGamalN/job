import { Schema, model } from "mongoose";
const InterestSchema = new Schema(
  {
    userId: { type: String, ref: "Users", required: true, unique: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
    timeZone: { type: String, required: true },
  },
  { timestamps: true }
);

const Interest = model("Interest", InterestSchema);
export default Interest;
