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
      staticFile: process.env.STATIC_FOLDER,
      secret: process.env.SECRET || "defaultSecret",
      expiresIn: process.env.EXPIREIN || "1d",
      emailHost: process.env.EMAILHOST,
      emailUser: process.env.EMAILUSER || "",
      emailPass: process.env.EMAILPASS || "",
      appUrl: process.env.APP_URL || "",
      mailPort: Number(process.env.MAIL_PORT),
      email: process.env.EMAIL || "example@example.com",
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
