import { Schema, model } from "mongoose";
import { ConnectionDtoType } from "../../../dto/profiles/connection.dto";
const ConnectionSchema = new Schema(
  {
    actorId: {
      type: String,
      refPath: "ownerModel",
      required: true,
      unique: true,
    },
    ownerType: {
      type: String,
      required: true,
      enum: ["user", "company", "school"],
      default: "user",
    },
    connectorId: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked", "unBlocked"],
      default: "pending",
    },
    blockedAt: { type: Date, default: null },
    unBlockedAt: { type: Date, default: null },
    history: {
      action: {
        type: String,
        enum: ["blocked", "unBlocked", "accepted"],
        default: null,
      },
      actionBy: { type: String, default: null },
      actionAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);
ConnectionSchema.index({ actorId: 1, connectorId: 1 }, { unique: true });
ConnectionSchema.index({ connectorId: 1 });
const Connection = model<ConnectionDtoType>(
  "user_connections",
  ConnectionSchema
);
export default Connection;
