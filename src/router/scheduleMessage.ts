import { Router } from "express";
import { messageController } from "../controller/message.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const messageRouter = Router();

messageRouter.post("/message", asyncHandler(messageController));
