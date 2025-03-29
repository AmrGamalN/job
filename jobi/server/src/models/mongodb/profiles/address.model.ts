import { Schema, model } from "mongoose";
const AddressSchema = new Schema(
  {
    userId: { type: String, ref: "users", required: true, unique: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
    timeZone: { type: String, required: true },
  },
  { timestamps: true }
);

const Address = model("addresses", AddressSchema);
export default Address;
