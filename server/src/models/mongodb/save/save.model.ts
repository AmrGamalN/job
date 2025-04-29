import { Schema, model } from "mongoose";
import { SaveDtoType } from "../../../dto/save/save.dto";
const SaveSchema = new Schema(
  {
    actorId: {
      type: String,
      required: true,
    },
    actorType: {
      type: String,
      enum: ["user", "company", "school", "group", "post", "job"],
      required: true,
    },
    targetId: {
      type: String,
      refPath: "ownerModel",
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
