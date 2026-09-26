import { Router } from "express";
import { listAggregatedPolicyOfUser, policyInfoController } from "../controller/policyInfot.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const policyInfoRouter = Router();

policyInfoRouter.post("/policyInfo", asyncHandler(policyInfoController));
policyInfoRouter.post("/allUser", asyncHandler(listAggregatedPolicyOfUser));
