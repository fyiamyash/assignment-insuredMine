import mongoose from "mongoose";
import { envCustom } from "../utils/envCustom.js";

export async function connectDb(threadName: string) {
  try {
    const dbUrl = envCustom.mongoUrl;

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected for :", threadName, mongoose.connection.name);
    });
    await mongoose.connect(dbUrl!);
  } catch (err) {
    console.error("Error while connecting to DB", err);
    process.exit(1);
  }
}
