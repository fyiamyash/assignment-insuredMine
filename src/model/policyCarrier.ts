import mongoose, { Schema } from "mongoose";

const policyCarrierSchema = new Schema({
  company_name: { type: String, required: true },
});

export const policyCarrierModel = mongoose.model("PolicyCarrier", policyCarrierSchema);
