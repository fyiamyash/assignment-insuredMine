import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String },
  state: { type: String },
  zip: { type: String },
  email: { type: String },
  gender: { type: String },
  userType: { type: String },
});

export const userModel = mongoose.model("User", userSchema);
