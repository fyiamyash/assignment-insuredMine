import { Router } from "express";
import { listAggregatedPolicyOfUser, policyInfoController } from "../controller/policyInfot.js";

export const policyInfoRouter = Router();

policyInfoRouter.post("/policyInfo", policyInfoController);
policyInfoRouter.post("/allUser", listAggregatedPolicyOfUser);
