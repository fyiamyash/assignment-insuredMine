import { Queue } from "bullmq";

export const messageQueue = new Queue("messages", {
  defaultJobOptions: { removeOnComplete: true },
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});
