import { Worker } from "bullmq";
import { messageModel } from "../../model/message.js";
import { now } from "mongoose";
import { scheduleMessageModel } from "../../model/scheduledMessage.js";
import { id } from "zod/locales";

const messageWorker = new Worker(
  "messages",
  async (Job) => {
    const { id, message, scheduledAt } = Job.data;
    await messageModel.create({
      message: message,
      scheduledAt: scheduledAt,
      recievedAt: now(),
    });
    await scheduleMessageModel.findByIdAndUpdate(id, { Jobstatus: "done" });
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  },
);

messageWorker.on("completed", (Job) => {
  console.log(`Job Id completed :${Job.id} `);
});

messageWorker.on("failed", (Job) => {
  if (Job) {
    console.log(`Job Id completed :${Job.id} `);
  }
});
