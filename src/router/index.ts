import { Router } from "express";
import { policyUploadRouter } from "./fileUploadRouter.js";
import { policyInfoRouter } from "./policyInfo.js";

export const appRouter = Router();

appRouter.use(policyUploadRouter);
appRouter.use(policyInfoRouter);
