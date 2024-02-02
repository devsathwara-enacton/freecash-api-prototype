import { sql } from "kysely";
import app from "../app";

export const fetch = async () => {
  const result = await app.db
    .selectFrom("offerwall_networks")
    .select(["id", "name", "code", "logo"])
    .execute();
  return result;
};
