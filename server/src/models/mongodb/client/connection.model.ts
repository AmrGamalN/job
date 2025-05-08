import { Schema, model } from "mongoose";
import { ConnectionDtoType } from "../../../dto/client/connection.dto";
import { blockEnum, connectionEnum } from "../../../types/client.type";
const ConnectionSchema = new Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    recipientId: { type: String, required: true },
    recipientName: { type: String, required: true },
    status: {
      type: String,
      enum: connectionEnum,
      default: "pending",
    },
    blockStatus: {
      type: String,
      enum: blockEnum,
      default: "unBlocked",
    },
    blockedAt: { type: Date, default: null },
    unblockedAt: { type: Date, default: null },
    history: {
      blockStatus: {
        type: String,
        enum: blockEnum,
        default: null,
      },
      actionBy: { type: String, default: "" },
      actionAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);
ConnectionSchema.index({ senderId: 1, recipientId: 1 }, { unique: true });
const Connection = model<ConnectionDtoType>(
  "user_connections",
  ConnectionSchema
);
export default Connection;
