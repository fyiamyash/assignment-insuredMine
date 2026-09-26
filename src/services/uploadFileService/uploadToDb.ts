import e from "express";
import { AgentModel } from "../../model/agent.js";
import { policyCategoryModel } from "../../model/lob.js";
import { policyCarrierModel } from "../../model/policyCarrier.js";
import { userModel } from "../../model/user.js";

import { policyModel } from "../../model/policy.js";
import { userAccountModel } from "../../model/userAccount.js";
import type { rowData } from "./uploadTypes.js";

export async function uploadToDb(batch: rowData[]) {
  console.log("next batch started:", new Date());
  const agentOperation = batch.map((e) => ({
    updateOne: {
      filter: {
        agentName: e.agent,
      },
      update: {
        $setOnInsert: {
          agentName: e.agent,
        },
      },
      upsert: true,
    },
  }));

  const lobOperation = batch.map((e) => ({
    updateOne: {
      filter: { category_name: e.category_name },
      update: {
        $setOnInsert: {
          category_name: e.category_name,
        },
      },
      upsert: true,
    },
  }));

  const policyCarrierOpration = batch.map((e) => ({
    updateOne: {
      filter: {
        company_name: e.company_name,
      },
      update: {
        $setOnInsert: {
          company_name: e.company_name,
        },
      },
      upsert: true,
    },
  }));

  const userOperation = batch.map((e) => ({
    updateOne: {
      filter: {
        firstName: e.firstname,
        dob: new Date(e.dob),
      },
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

  try {
    await Promise.all([
      AgentModel.bulkWrite(agentOperation),
      policyCategoryModel.bulkWrite(lobOperation),
      policyCarrierModel.bulkWrite(policyCarrierOpration),
      userModel.bulkWrite(userOperation),
    ]);

    const agents = [...new Set(batch.map((e) => e.agent).filter(Boolean))];
    const lob = [...new Set(batch.map((e) => e.category_name).filter(Boolean))];
    const carrier = [...new Set(batch.map((e) => e.company_name).filter(Boolean))];
    const user = [
      ...new Set(batch.map((e) => ({ firstName: e.firstname, dob: e.dob })).filter(Boolean)),
    ];

    const findAgents = await AgentModel.find({
      agentName: { $in: agents },
    });
    const findLob = await policyCategoryModel.find({
      category_name: { $in: lob },
    });
    const findCarrier = await policyCarrierModel.find({
      company_name: { $in: carrier },
    });

    const findUser = await userModel.find({
      $or: user,
    });

    const agentMap = new Map(findAgents.map((e) => [e.agentName, e._id]));
    const lobMap = new Map(findLob.map((e) => [e.category_name, e._id]));
    const carrierMap = new Map(findCarrier.map((e) => [e.company_name, e._id]));
    const userMap = new Map(findUser.map((e) => [`${e.firstName}|${e.dob.toISOString()}`, e._id]));

    const policyOperations = batch.map((e) => {
      const userKey = `${e.firstname}|${new Date(e.dob).toISOString()}`;
      const agentId = agentMap.get(e.agent);
      const categoryId = lobMap.get(e.category_name);
      const carrierId = carrierMap.get(e.company_name);
      const userId = userMap.get(userKey);
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
      return {
        updateOne: {
          filter: {
            policyNumber: e.policy_number,
          },

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
      };
    });

    const accountOperations = batch.map((e) => {
      const userKey = `${e.firstname}|${new Date(e.dob).toISOString()}`;

      return {
        updateOne: {
          filter: {
            accountName: e.account_name,
          },

          update: {
            $setOnInsert: {
              accountName: e.account_name,
              userId: userMap.get(userKey) ?? null,
            },
          },

          upsert: true,
        },
      };
    });

    await Promise.all([
      policyModel.bulkWrite(policyOperations),
      userAccountModel.bulkWrite(accountOperations),
    ]);

    return;
  } catch (err) {
    console.error("current batch failed", err);
    throw err;
  }
}
