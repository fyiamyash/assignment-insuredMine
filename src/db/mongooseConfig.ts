import mongoose from "mongoose";

export async function connectDb() {
  try {
    await mongoose.connect("");
    console.log("Connected to Database!");
  } catch (err) {
    console.error("Error while connecting to DB", err);
    process.exit(1);
  }
}
