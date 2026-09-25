import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pidusage from "pidusage";

const currentPath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(currentPath);
const processId = await fs.readFile(path.join(__dirname, "../../server.txt"), "utf-8");
async function monitorCpu() {
  const stats = await pidusage(Number(processId));

  console.log("CPU Usage of Main Server:", stats.cpu.toFixed(2) + "%");

  if (stats.cpu >= 70) {
    console.log("CPU Usage of Main Server exceeded 70%");

    process.kill(Number(processId), "SIGTERM");
    return;
  }

  setTimeout(monitorCpu, 5000);
}

monitorCpu();
