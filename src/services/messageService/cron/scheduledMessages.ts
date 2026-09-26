import cron from "node-cron";
import { scheduleMessageModel } from "../../../model/scheduledMessage.js";
import { messageQueue } from "../../../queue/messageQueue.js";

cron.schedule("* * * * *", async () => {
  console.log("cron job ran at:", new Date());
  const result = await scheduleMessageModel.find({
    scheduledAt: { $lte: new Date() },
    Jobstatus: "pending",
  });

  if (result.length <= 0) {
    return;
  }

  for (const mess of result) {
    const updatedResult = await scheduleMessageModel.findByIdAndUpdate(
      { _id: mess._id, jobStatus: "pending" },
      { $set: { jobStatus: "queued" } },
      { returnDocument: "after" },
    );
    if (!updatedResult) {
      continue;
    }
    await messageQueue.add("message", {
      message: updatedResult.message,
      scheduledAt: updatedResult.scheduledAt,
      id: updatedResult._id,
    });
    console.log("message added!");
  }
});
