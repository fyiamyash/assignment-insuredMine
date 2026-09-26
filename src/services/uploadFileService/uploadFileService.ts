import { Worker } from "node:worker_threads";
export async function uploadFileService(filepath: string) {
  const workerPath = new URL("../../workerThread/worker.js", import.meta.url);
  const worker1 = new Worker(workerPath, {
    workerData: {
      filePath: filepath,
    },
  });

  worker1.on("message", (message) => {
    console.log("worker Message:", message);
  });
  worker1.on("error", (err) => {
    console.log("worker error:", err);
  });

  worker1.on("exit", (code) => {
    console.log("exit code ", code);
  });
}
