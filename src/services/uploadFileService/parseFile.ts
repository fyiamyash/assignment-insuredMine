import fs from "fs";
import csv from "csv-parser";
import type { createCacheTypes, rowData } from "./uploadTypes.js";
import { createCache } from "./utilFunction.js";
import { uploadToDb } from "./uploadToDb.js";
import { uploadToDb2 } from "./uploadToDb2.js";

export async function parseFile(filePath: string) {
  const MAX_QUEUE_SIZE = 50;

  const queue: rowData[] = [];
  try {
    const readstream = fs.createReadStream(filePath).pipe(csv());
    for await (const row of readstream) {
      queue.push(row as rowData);

      if (queue.length >= MAX_QUEUE_SIZE) {
        const batch = queue.splice(0);
        const cache = createCache();
        await uploadToDb2(batch, cache);
      }
    }

    if (queue.length > 0) {
      await uploadToDb(queue.splice(0));
    }

    console.log("Reading complete");
  } catch (err) {
    console.error("error in reading", err);
    throw err;
  }
}
