import type { Request, Response } from "express";
import z from "zod";
import { MessageBody } from "../zodValidation/zodtypes.js";
import { scheduleMessageModel } from "../model/scheduledMessage.js";

export async function messageController(req: Request, res: Response) {
  const safeMessageBody = MessageBody.safeParse(req.body);
  if (!safeMessageBody.success) {
    res.status(404).json({ error: safeMessageBody.error });
    return;
  }
  const { message, date, time } = safeMessageBody.data;
  const formattedTime = toTimestamp(date, time);
  const stored = await scheduleMessageModel.create({
    message: message,
    scheduledAt: formattedTime,
    Jobstatus: "pending",
  });
  if (!stored) {
    res.status(500).json({ error: "Internal error, try again later!" });
    return;
  }
  res.send({ response: "Message scheduled!" });
}

function toTimestamp(date: string, time: string) {
  const dateMatch = /^(\d{2})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!dateMatch || !timeMatch) {
    throw new Error("Invalid date or time format");
  }
  const mm = Number(dateMatch[1]);
  const dd = Number(dateMatch[2]);
  const yy = Number(dateMatch[3]);
  const hh = Number(timeMatch[1]);
  const min = Number(timeMatch[2]);
  const fullYear = 2000 + yy;
  return new Date(fullYear, mm - 1, dd, hh, min);
}
