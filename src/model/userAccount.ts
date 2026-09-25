import mongoose, { Schema } from "mongoose";

const userAccountSchema = new Schema({
  accountName: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

export const userAccountModel = mongoose.model("UserAccount", userAccountSchema);
