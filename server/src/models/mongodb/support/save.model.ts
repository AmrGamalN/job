import { Schema, model } from "mongoose";
import { SaveDtoType } from "../../../dto/support/save.dto";
const SaveSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      refPath: "targetType",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["user", "company", "school", "group", "post", "job"],
      required: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Save = model<SaveDtoType>("save_saves", SaveSchema);
export default Save;
