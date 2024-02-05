import app from "../app";
import { UserTbl } from "../database/db";

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const result = app.db
    .insertInto("user_tbl")
    .values({ email: email, name: name, password: password })
    .execute();
  return result;
};
export const registerSocial = async (
  name: string,
  email: string,
  googleId: string | null,
  facebookId: string | null
) => {
  const result = app.db
    .insertInto("user_tbl")
    .values({
      email: email,
      name: name,
      googleId: googleId,
      facebookId: facebookId,
    })
    .execute();
  return result;
};

export const login = async (email: string) => {
  const result = app.db
    .selectFrom("user_tbl")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();
  return result;
};
