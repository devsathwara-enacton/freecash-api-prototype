import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { db } from "./database/database";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { swaggerOptions, swaggerUiOptions } from "./utils/swagger";
import fastifyCookie from "@fastify/cookie";
import fastifySecureSession from "@fastify/secure-session";
import fastifyPassport from "@fastify/passport";
import "./utils/passport";
import cors from "@fastify/cors";
import { config } from "./config/config";
import view from "@fastify/view";
import ejs from "ejs";
import path from "path";
import { createJWTToken } from "./utils/jwt";

// Extend FastifyInstance to include the 'db' property
interface CustomFastifyInstance extends FastifyInstance {
  db: Kysely<DB>;
}

// Helper function to create app instance
const createApp = (): CustomFastifyInstance => {
  const app = fastify({ logger: true }) as unknown as CustomFastifyInstance;
  app.decorate("db", db);
  const sessionSecret = config.env.app.sessionSecret?.toString();
  if (!sessionSecret) {
    throw new Error("Session secret is not defined in the config");
  }
  const sessionSalt = config.env.app.sessionSalt?.toString();
  if (!sessionSalt) {
    throw new Error("Session salt is not defined in the config");
  }
  app.register(require("fastify-healthcheck"));
  app.setErrorHandler(
    (error: Error, request: FastifyRequest, reply: FastifyReply) => {
      console.log(error.toString());
      reply.send({ error: error });
    }
  );
  app.register(cors);
  app.register(fastifyCookie);

  app.register(fastifySecureSession, {
    secret: sessionSecret,
    salt: sessionSalt,
    sessionName: config.env.app.sessionName,
    cookieName: config.env.app.cookieName,
    cookie: {
      path: "/",
      httpOnly: false,
      expires: new Date(Date.now() + 3600000),
      sameSite: "none",
      secure: true,
      // domain: ".enactweb.com",
    },
  });
  app.register(fastifyPassport.initialize());
  app.register(fastifyPassport.secureSession());
  app.register(fastifySwagger, swaggerOptions);
  app.register(fastifySwaggerUi, swaggerUiOptions);
  app.register(require("@fastify/formbody"));
  app.register(view, {
    engine: {
      ejs,
    },
    templates: path.join(__dirname, "templates"),
  });

  app.register(import("./routes/taskRoutes"), { prefix: "/api/v1/task" });
  app.register(import("./routes/authRoutes"), { prefix: "/api/v1/auth" });
  app.register(import("./routes/providersRoutes"), {
    prefix: "/api/v1/offer-providers",
  });
  app.register(import("./routes/postbackRoutes"), {
    prefix: "/api/v1/postback",
  });
  app.register(import("./routes/categoriesRoutes"), {
    prefix: "/api/v1/offer-categories",
  });
  app.get(
    "/auth/google/callback",
    {
      preValidation: fastifyPassport.authenticate("google", {
        scope: ["profile", "email"],
        state: "sds3sddd",
        failureRedirect: "/",
      }),
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      let accessToken = await createJWTToken(
        { user: req.user },
        `${parseInt(config.env.app.expiresIn)}h`
      );
      reply.setCookie("accessToken", accessToken.toString(), {
        path: "/",
        httpOnly: false,
        expires: new Date(Date.now() + 3600000),
        sameSite: "none",
        secure: true,
      });
      console.log(accessToken);
      reply.redirect("https://coral-optimal-commonly.ngrok-free.app/success");
    }
  );
  app.get(
    "/auth/facebook/callback",
    {
      preHandler: fastifyPassport.authenticate("facebook", {
        failureRedirect: "/login",
      }),
    },
    function (req: FastifyRequest, reply: FastifyReply) {
      let newAccessToken = Math.floor(Math.random() * 10);
      reply.setCookie("accessToken", newAccessToken.toString(), {
        path: "/",
        httpOnly: false,
        expires: new Date(Date.now() + 3600000),
        sameSite: "none",
        secure: true,
      });
      reply.redirect("/success");
    }
  );

  app.register(require("@fastify/static"), {
    root: `${config.env.app.staticFile}/freecash-api/static`,
    prefix: "/public/",
  });
  app.get("/success", (req: FastifyRequest, reply: FastifyReply) => {
    // Render the "index.ejs" template
    const accessToken = req.cookies.accessToken;
    console.log(accessToken);
    reply.view("success.ejs", {
      /* optional template context */
      accessToken: accessToken,
    });
  });

  return app;
};

// Create app instance using the helper function
const app: CustomFastifyInstance = createApp();
export default app;
