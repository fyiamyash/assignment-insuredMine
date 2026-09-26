import fs from "node:fs/promises";
import path from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";
import pidusage from "pidusage";

const currentPath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(currentPath);
const processId = await fs.readFile(path.join(__dirname, "../../server.txt"), "utf-8");

async function monitorCpu() {
  try {
    const stats = await pidusage(Number(processId));

    console.log("CPU Usage of Main Server:", stats.cpu.toFixed(2) + "%");

    if (stats.cpu >= 70) {
      console.log("CPU Usage of Main Server exceeded 70%");

      process.kill(Number(processId), "SIGTERM");
      clearInterval(intervalId);
      return;
    }
  } catch (er: any) {
    clearInterval(intervalId);
    if (er.code == `ENOENT`) {
      console.error(`No Process running on PID:${processId} to check`);
      exit(1);
    }
    console.error(`error:${er}`);
    exit(1);
  }
}
let intervalId = setInterval(monitorCpu, 3000);
