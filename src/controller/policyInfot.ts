import type { Request, Response } from "express";
import { policyModel } from "../model/policy.js";
import { userModel } from "../model/user.js";
import { IncomingBodyType } from "../zodValidation/zodtypes.js";

export async function policyInfoController(req: Request, res: Response) {
  const safeBody = IncomingBodyType.safeParse(req.body);
  if (!safeBody.success) {
    res.status(404).json({ err: safeBody.error });
    return;
  }
  const { username } = safeBody.data;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * 5;

  const userExist = await userModel.findOne({ firstName: username });
  if (!userExist) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const policyData = await policyModel
    .find({
      user: userExist._id,
    })
    .populate("agent", "agentName")
    .populate("Category", "category_name")
    .populate("company", "company_name")
    .populate("user", "firstName email")
    .skip(skip)
    .limit(3)
    .lean();

  const transformedData = policyData.map((e: any) => ({
    policyNumber: e.policyNumber,
    Category: e.Category.category_name,
    StartDate: e.StartDate.toLocaleDateString(),
    EndDate: e.EndDate.toLocaleDateString(),
    agent: e.agent.agentName,
    username: e.user.firstName,
    email: e.user.email,
  }));

  res.send(transformedData);
}

export async function listAggregatedPolicyOfUser(req: Request, res: Response) {
  const limit = Number(req.query.limit) || 5;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const result = await userModel
    .aggregate([
      {
        $lookup: {
          from: "policies",
          localField: "_id",
          foreignField: "user",
          as: "policies",
        },
      },
      {
        $unwind: "$policies",
      },
      {
        $lookup: {
          from: "agents",
          localField: "policies.agent",
          foreignField: "_id",
          as: "agent",
        },
      },
      {
        $lookup: {
          from: "policycarriers",
          localField: "policies.company",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $lookup: {
          from: "policycategories",
          localField: "policies.Category",
          foreignField: "_id",
          as: "category",
        },
      },
    ])
    .skip(skip)
    .limit(limit);

  const transformedData = result.map((e) => ({
    firstName: e.firstName,
    dob: e.dob,
    address: e.address,
    zip: e.zip,
    email: e.email,
    gender: e.gender,
    state: e.state,
    userType: e.userType,
    policies: {
      policyNumber: e.policies.policyNumber,
      StartDate: e.policies.StartDate.toLocaleDateString(),
      EndDate: e.policies.EndDate.toLocaleDateString(),
      Category: e.category[0].category_name,
      company: e.company[0].company_name,
      agent: e.agent[0].agentName,
    },
  }));

  if (!result) {
    res.send({ message: "No data found" });
    return;
  }
  res.send(transformedData);
}
