import express from "express";
import { connectDb } from "./db/mongooseConfig.js";
import fs from "fs/promises";
import { appRouter } from "./router/index.js";
import "./services/messageService/cron/scheduledMessages.js";
import "./services/messageService/sendMessageWorker.js";
const app = express();

connectDb("Main");
app.use(express.json());
app.use(appRouter);

app.listen(3000, () => {
  console.log("app is listening on port 3000 ");
});
fs.writeFile("./server.txt", String(process.pid));
