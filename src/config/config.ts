import dotenv from "dotenv";

dotenv.config();

export const config = {
  env: {
    app: {
      port: process.env.PORT,
      url: process.env.URL,
      host: process.env.HOST,
      sessionSecret: process.env.SESSION_SECRET,
      sessionSalt: process.env.SESSION_SALT,
      sessionName: process.env.SESSION_NAME,
      cookieName: process.env.COOKIE_NAME,
    },
    database: {
      port: process.env.DATABASE_PORT,
      name: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      url: process.env.DATABASE_URL,
      host: process.env.DATABASE_HOST,
    },
  },
};
