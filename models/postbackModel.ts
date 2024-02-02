import { sql } from "kysely";
import app from "../app";

export const insertLog = async (
  network: string,
  transaction_id: string,
  payload: any,
  data: any,
  status: "pending" | "processed" | "error",
  message: string
) => {
  console.log(JSON.stringify(payload));
  const result = await app.db
    .insertInto("offerwall_postback_logs")
    .values({
      network: network,
      transaction_id: transaction_id,
      payload: JSON.stringify(payload),
      data: JSON.stringify(data),
      status: status,
      message: message,
    })
    .execute();
  return result;
};
export const insert = async (
  network: string,
  transaction_id: string,
  user_id: number,
  task_offer_id: string,
  network_goal_id: string,
  offer_id: string,
  task_name: string,
  task_type: string,
  amount: number,
  payout: number,
  status: "pending" | "confirmed" | "declined",
  extra_info: object,
  mail_sent: number
) => {
  const result = await app.db
    .insertInto("user_offerwall_sales")
    .values({
      network: network,
      transaction_id: transaction_id,
      user_id: user_id,
      task_offer_id: task_offer_id,
      network_goal_id: network_goal_id,
      offer_id: offer_id,
      task_name: task_name,
      task_type: task_type,
      amount: amount,
      payout: payout,
      status: status,
      extra_info: JSON.stringify(extra_info),
      mail_sent: mail_sent,
    })
    .execute();
  return result;
};
