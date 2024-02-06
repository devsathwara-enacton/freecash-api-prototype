import { sql } from "kysely";
import app from "../app";
export const fetch = async () => {
  const result = app.db
    .selectFrom("offerwall_categories")
    .select(["id", "name", "icon", "bg_color", "sort_order"])
    .orderBy("sort_order asc")
    .execute();
  return result;
};
