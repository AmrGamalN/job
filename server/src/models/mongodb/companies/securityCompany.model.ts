const mongoose = require("mongoose");
const { Schema } = mongoose;

const CompanySchema = new Schema(
  {
    companyId: { type: String, required: true, unique: true },
    roles: [
      {
        userId: { type: String, required: true },
        role: {
          type: String,
          enum: ["owner", "admin", "member"],
          default: "member",
        },
      },
    ],

    legalInfo: {
      registrationNumber: { type: String },
      taxId: { type: String },
      legalName: { type: String },
      countryOfIncorporation: { type: String },
    },

    status: {
      type: String,
      enum: ["active", "inactive", "pending", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);
