import mongoose, { Schema } from "mongoose";
import { required } from "zod/mini";

const messageSchema = new Schema({
  message: { type: String, required: true },
  scheduledAt: { type: Date },
  recievedAt: { type: Date },
});

export const messageModel = mongoose.model("Messages", messageSchema);
