import mongoose, { Schema } from "mongoose";

const policyInfoSchema = new Schema({
  policyNumber: { type: String, require: true },
  StartDate: { type: Date, require: true },
  EndDate: { type: Date, require: true },
  agent: { type: mongoose.Types.ObjectId, require: true, ref: "Agent" },
  Category: { type: mongoose.Types.ObjectId, require: true },
  company: { type: mongoose.Types.ObjectId, require: true },
  user: { type: mongoose.Types.ObjectId, require: true },
});

export const policyModel = mongoose.model("Policy", policyInfoSchema);
