import mongoose, { Schema } from "mongoose";

const userAccountSchema = new Schema({
  accountName: { type: String },
});

export const userAccountModel = mongoose.model("UserAccount", userAccountSchema);
