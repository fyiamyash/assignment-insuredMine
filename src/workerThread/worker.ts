import { workerData, parentPort } from "worker_threads";

import { uploadToDb } from "../services/uploadFileService/uploadToDb.js";
import { connectDb } from "../db/mongooseConfig.js";
import { parseFile } from "../services/uploadFileService/parseFile.js";

const { filePath } = workerData;
console.log(filePath);
async function run() {
  try {
    console.log(`Starting import: ${filePath}`);
    await connectDb("worker");
    await parseFile(filePath);
    console.log(`Import completed: ${filePath}`);

    parentPort?.postMessage({
      type: "success",
    });
  } catch (err) {
    console.error(err);
  }
}

run();
