import mongoose, { Schema } from "mongoose";

const scheduleMessageSchema = new Schema({
  message: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  Jobstatus: { type: String, required: true, enum: ["pending", "queued", "done"] },
});

export const scheduleMessageModel = mongoose.model("ScheduledMessages", scheduleMessageSchema);
