import mongoose, { Schema } from "mongoose";

const agentSchema = new Schema({
  agentName: { type: String, required: true },
});

export const AgentModel = mongoose.model("Agent", agentSchema);
