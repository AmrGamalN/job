import { Schema, model } from "mongoose";
import { AddressDtoType } from "../../../dto/client/address.dto";
const AddressSchema = new Schema(
  {
    userId: {
      type: String,
      refPath: "ownerType",
      required: true,
      unique: true,
    },
    ownerType: {
      type: String,
      required: true,
      enum: ["user", "company", "school"],
      default: "user",
    },
    country: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
    timeZone: { type: String, required: true },
  },
  { timestamps: true }
);

const Address = model<AddressDtoType>("user_addresses", AddressSchema);
export default Address;
