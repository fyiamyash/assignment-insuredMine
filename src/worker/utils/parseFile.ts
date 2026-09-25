import fs from "fs";
import csv from "csv-parser";
import type { rowData } from "./uploadTypes.js";

export async function parseFile(filePath: string, upload: (rows: rowData[]) => Promise<void>) {
  const MAX_QUEUE_SIZE = 50;

  const queue: rowData[] = [];
  try {
    const readstream = fs.createReadStream(filePath).pipe(csv());
    for await (const row of readstream) {
      queue.push(row as rowData);

      if (queue.length >= MAX_QUEUE_SIZE) {
        const batch = queue.splice(0);

        await upload(batch);
      }
    }

    if (queue.length > 0) {
      await upload(queue.splice(0));
    }

    console.log("Reading complete");
  } catch (err) {
    console.error("error in reading", err);
    throw err;
  }
}
