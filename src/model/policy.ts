import mongoose, { Schema } from "mongoose";

const policyInfoSchema = new Schema({
  policyNumber: { type: String, required: true },
  StartDate: { type: Date, required: true },
  EndDate: { type: Date, required: true },
  agent: { type: mongoose.Types.ObjectId, required: true, ref: "Agent" },
  Category: { type: mongoose.Types.ObjectId, required: true, ref: "PolicyCategory" },
  company: { type: mongoose.Types.ObjectId, required: true, ref: "PolicyCarrier" },
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

export const policyModel = mongoose.model("Policy", policyInfoSchema);
