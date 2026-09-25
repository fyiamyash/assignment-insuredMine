import mongoose, { Schema } from "mongoose";

const policyCarrierSchema = new Schema({
  company_name: { type: String },
});

export const policyCarrierModel = mongoose.model("PolicyCarrier", policyCarrierSchema);
