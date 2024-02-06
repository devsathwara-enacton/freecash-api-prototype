import { sql } from "kysely";
import app from "../app";

export const fetch = async (type: "tasks" | "surveys", name: string) => {
  const result = app.db
    .selectFrom("offerwall_networks")
    .selectAll()
    .where("type", "=", type)
    .where("code", "=", name)
    .executeTakeFirst();
  return result;
};
