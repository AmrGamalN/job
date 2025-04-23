import { Schema, model } from "mongoose";
import { AddressDtoType } from "../../../dto/profiles/address.dto";
const AddressSchema = new Schema(
  {
    ownerId: { type: String, ref: "users", required: true, unique: true },
    ownerType: {
      type: String,
      required: true,
      enum: ["users", "Companies", "schools"],
    },
    country: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
    timeZone: { type: String, required: true },
  },
  { timestamps: true }
);

const Address = model<AddressDtoType>("addresses", AddressSchema);
export default Address;
