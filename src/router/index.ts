import { Router } from "express";
import { UploadRouter } from "./fileUploadRouter.js";
import { policyInfoRouter } from "./policyInfo.js";
import { messageRouter } from "./scheduleMessage.js";

export const appRouter = Router();

appRouter.use(UploadRouter);
appRouter.use(policyInfoRouter);
appRouter.use(messageRouter);
