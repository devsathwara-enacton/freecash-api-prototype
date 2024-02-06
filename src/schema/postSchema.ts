export const postbackSchema = {
  tags: ["Postback"],
  querystring: {
    type: "object",
    properties: {
      type: { type: "string" },
      network: { type: "string" },
      transaction_id: { type: "string" },
      user_id: { type: "number" },
      offer_name: { type: "string" },
      offer_id: { type: "string" },
      amount: { type: "number" },
      payout: { type: "number" },
      network_goal_id: { type: "string" },
      ikey: { type: "string" },
      hash: { type: "string" },
    },
  },
};
