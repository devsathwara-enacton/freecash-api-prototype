import { FastifyReply, FastifyRequest } from "fastify";
import app from "../app";

import crypto from "crypto";
import { postback, networks } from "../models";
const validateHash = (receivedHash: string, combinedData: any) => {
  // Create a hash using the combined data and the secret key
  const generatedHash = crypto
    .createHash("md5")
    .update(combinedData.toString())
    .digest("hex");
  console.log(generatedHash);
  // Compare the generated hash with the received hash
  return generatedHash === receivedHash;
};
export const validate = async (req: FastifyRequest, reply: FastifyReply) => {
  const {
    type,
    network,
    transaction_id,
    user_id,
    offer_name,
    offer_id,
    amount,
    payout,
    network_goal_id,
    ikey,
    hash,
  } = req.query as {
    type: "tasks" | "surveys";
    network: string;
    transaction_id: string;
    user_id: number;
    offer_name: string;
    offer_id: string;
    amount: number;
    payout: number;
    network_goal_id: string;
    ikey: string;
    hash: string;
  };
  const data = {
    type: type,
    network: network,
    transaction_id: transaction_id,
    user_id: user_id,
    offer_name: offer_name,
    offer_id: offer_id,
    amount: amount,
    payout: payout,
    network_goal_id: network_goal_id,
    ikey: ikey,
    hash: hash,
  };
  const res = await networks.fetch(type, network);
  if (res?.postback_validation_key === ikey) {
    const validateData = {
      type: type,
      network: network,
      transaction_id: transaction_id,
      user_id: user_id,
      offer_name: offer_name,
      offer_id: offer_id,
      amount: amount,
      payout: payout,
      network_goal_id: network_goal_id,
      ikey: ikey,
    };
    const validate = validateHash(hash, validateData);
    if (validate == true) {
      const result = await postback.insert(
        network,
        transaction_id,
        user_id,
        network + offer_id,
        network_goal_id,
        offer_id,
        offer_name,
        type,
        amount,
        payout,
        "confirmed",
        data,
        0
      );
      const ins = await postback.insertLog(
        network,
        transaction_id,
        data,
        data,
        "processed",
        "Postback Hash Verification Successful"
      );
      return reply
        .status(200)
        .send({ message: "Postback Hash Verification Successful" });
    } else {
      const ins = await postback.insertLog(
        network,
        transaction_id,
        data,
        data,
        "error",
        "Postback Hash Verification Missing"
      );
      return reply
        .status(401)
        .send({ error: "Postback Hash Verification Missing" });
    }
  } else {
    const ins = await postback.insertLog(
      network,
      transaction_id,
      data,
      data,
      "error",
      "ikey is invalid"
    );

    if (ins) {
      return reply.status(401).send({ error: "Invalid credentials." });
    } else {
      return reply.status(503).send("Error creating log");
    }
  }
};
