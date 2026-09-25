import mongoose, { Schema } from "mongoose";

const agentSchema = new Schema({
  agentName: { type: String },
});

export const AgentModel = mongoose.model("Agent", agentSchema);
