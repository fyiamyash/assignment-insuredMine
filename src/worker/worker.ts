import { workerData, parentPort } from "worker_threads";
import { parseFile } from "./utils/parseFile.js";
import { uploadToDb } from "./utils/uploadToDb.js";
import { connectDb } from "../db/mongooseConfig.js";

const { filePath } = workerData;
console.log(filePath);
async function run() {
  try {
    console.log(`Starting import: ${filePath}`);
    await connectDb("worker");
    await parseFile(filePath, uploadToDb);
    console.log(`Import completed: ${filePath}`);

    parentPort?.postMessage({
      type: "success",
    });
  } catch (err) {
    console.error(err);
  }
}

run();
