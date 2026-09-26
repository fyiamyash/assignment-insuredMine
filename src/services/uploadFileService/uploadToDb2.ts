import { AgentModel } from "../../model/agent.js";
import { policyCategoryModel } from "../../model/lob.js";
import { policyModel } from "../../model/policy.js";
import { policyCarrierModel } from "../../model/policyCarrier.js";
import { userModel } from "../../model/user.js";
import { userAccountModel } from "../../model/userAccount.js";
import type { createCacheTypes, rowData } from "./uploadTypes.js";
import { createDedup, userKey } from "./utilFunction.js";

export async function uploadToDb2(batch: rowData[], cache: createCacheTypes) {
  console.log("next batch started:", new Date());
  const agents = createDedup(batch.map((e) => e.agent));
  const carrier = createDedup(batch.map((e) => e.company_name));
  const category = createDedup(batch.map((e) => e.category_name));
  const userRows = new Map<string, rowData>();
  for (const e of batch) {
    const key = userKey(e.firstname, e.dob, e.email);
    if (!userRows.has(key)) userRows.set(key, e);
  }

  const agentsToFetch = agents.filter((e) => !cache.agent.has(e));
  const carriersToFetch = carrier.filter((e) => !cache.carrier.has(e));
  const categoryToFetch = category.filter((e) => !cache.category.has(e));

  const agentOperation = agentsToFetch.map((e) => ({
    updateOne: {
      filter: { agentName: e },
      update: { $setOnInsert: { agentName: e } },
      upsert: true,
    },
  }));

  const lobOperation = categoryToFetch.map((e) => ({
    updateOne: {
      filter: { category_name: e },
      update: { $setOnInsert: { category_name: e } },
      upsert: true,
    },
  }));

  const userOperation = [...userRows.values()].map((e) => ({
    updateOne: {
      filter: { firstName: e.firstname, dob: new Date(e.dob), email: e.email },
      update: {
        $setOnInsert: {
          firstName: e.firstname,
          dob: new Date(e.dob),
          address: e.address,
          state: e.state,
          zip: e.zip,
          email: e.email,
          gender: e.gender,
          userType: e.userType,
        },
      },
      upsert: true,
    },
  }));

  const carriersOperation = carriersToFetch.map((e) => ({
    updateOne: {
      filter: { company_name: e },
      update: { company_name: e },
      upsert: true,
    },
  }));

  await Promise.all([
    agentsToFetch.length ? AgentModel.bulkWrite(agentOperation, { ordered: false }) : null,
    carriersToFetch.length
      ? policyCarrierModel.bulkWrite(carriersOperation, { ordered: false })
      : null,
    categoryToFetch.length ? policyCategoryModel.bulkWrite(lobOperation, { ordered: false }) : null,
    userOperation.length ? userModel.bulkWrite(userOperation) : null,
  ]);

  const [agentFound, carrierFound, categoryFound, foundUsers] = await Promise.all([
    agentsToFetch.length ? AgentModel.find({ agentName: { $in: agentsToFetch } }) : [],
    carriersToFetch.length
      ? policyCarrierModel.find({ company_name: { $in: carriersToFetch } })
      : [],
    categoryToFetch.length
      ? policyCategoryModel.find({ category_name: { $in: categoryToFetch } })
      : [],
    userOperation.length
      ? userModel.find({ $or: userOperation.map((o) => o.updateOne.filter) })
      : [],
  ]);

  agentFound.forEach((e) => cache.agent.set(e.agentName, e._id));
  carrierFound.forEach((e) => cache.carrier.set(e.company_name, e._id));
  categoryFound.forEach((e) => cache.category.set(e.category_name, e._id));
  const userMap = new Map(foundUsers.map((u) => [userKey(u.firstName, u.dob, u.email!), u._id]));

  const policyOperations: any[] = [];
  const accountOperations: any[] = [];

  for (const e of batch) {
    const agentId = cache.agent.get(e.agent);
    const categoryId = cache.category.get(e.category_name);
    const carrierId = cache.carrier.get(e.company_name);
    const userId = userMap.get(userKey(e.firstname, e.dob, e.email));
    if (!agentId) {
      throw new Error(`Agent not found: ${e.agent}`);
    }

    if (!categoryId) {
      throw new Error(`Category not found: ${e.category_name}`);
    }

    if (!carrierId) {
      throw new Error(`Carrier not found: ${e.company_name}`);
    }

    if (!userId) {
      throw new Error(`User not found: ${e.firstname}, ${e.dob}`);
    }
    policyOperations.push({
      updateOne: {
        filter: { policyNumber: e.policy_number },
        update: {
          $setOnInsert: {
            policyNumber: e.policy_number,
            StartDate: new Date(e.policy_start_date),
            EndDate: new Date(e.policy_end_date),
            agent: agentId,
            Category: categoryId,
            company: carrierId,
            user: userId,
          },
        },
        upsert: true,
      },
    });
    accountOperations.push({
      updateOne: {
        filter: { accountName: e.account_name },
        update: {
          $setOnInsert: {
            accountName: e.account_name,
            userId,
          },
        },
        upsert: true,
      },
    });
  }
  try {
    await Promise.all([
      policyOperations.length ? policyModel.bulkWrite(policyOperations, { ordered: false }) : null,
      accountOperations.length
        ? userAccountModel.bulkWrite(accountOperations, { ordered: false })
        : null,
    ]);
  } catch (er) {
    console.error("policy/account upsert failed for batch", er);
    throw er;
  }
}
