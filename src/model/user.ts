import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, require: true },
  DOB: { type: Date, require: true },
  address: { type: String },
  state: { type: String },
  zip: { type: String },
  email: { type: String },
  gender: { type: String },
  userType: { type: String },
});

export const userModel = mongoose.model("User", userSchema);
