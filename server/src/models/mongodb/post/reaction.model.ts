import { Schema, model } from "mongoose";
import { ReactionDtoType } from "../../../dto/post/reaction.dto";
import { ReactionEnumType } from "../../../types/post.types";

const reactionSchema = new Schema(
  {
    userId: { type: String, ref: "user_users", required: true },
    targetId: { type: String, required: true },
    targetType: {
      type: String,
      enum: ["post", "comment"],
      required: true,
    },
    reactionType: {
      type: String,
      enum: ReactionEnumType,
      default: "LIKE",
      required: true,
    },
  },
  { timestamps: true }
);

reactionSchema.index({ userId: 1, id: 1 }, { unique: true });
const Reaction = model<ReactionDtoType>("post_reactions", reactionSchema);
export default Reaction;
