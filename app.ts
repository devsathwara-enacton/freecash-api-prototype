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
import path from "path";
import fs from "fs";
// Extend FastifyInstance to include the 'db' property
interface CustomFastifyInstance extends FastifyInstance {
  db: Kysely<DB>;
}

// Helper function to create app instance
const createApp = (): CustomFastifyInstance => {
  const app = fastify({ logger: true }) as unknown as CustomFastifyInstance;
  app.decorate("db", db);
  app.register(require("fastify-healthcheck"));
  app.setErrorHandler((error, request, reply) => {
    console.log(error.toString());
    reply.send({ error: error });
  });

  app.register(require("@fastify/static"), {
    root: path.join(__dirname, "public"),
  });
  app.register(cors);
  app.register(fastifyCookie);
  app.register(fastifySecureSession, {
    secret: "averylogphrasebiggerthanthirtytwochars",
    salt: "mq9hDxBVDbspDR6n",
    sessionName: "session",
    cookieName: "accessToken",
    cookie: {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
      sameSite: "none",
      secure: true,
    },
  });
  app.register(fastifyPassport.initialize());
  app.register(fastifyPassport.secureSession());
  app.register(fastifySwagger, swaggerOptions);
  app.register(fastifySwaggerUi, swaggerUiOptions);

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
    (req: FastifyRequest, reply: FastifyReply) => {
      reply.send("/home");
    }
  );
  app.get(
    "/auth/facebook/callback",
    {
      preHandler: fastifyPassport.authenticate("facebook", {
        failureRedirect: "/login",
      }),
    },
    function (req: FastifyRequest, res: FastifyReply) {
      // Successful authentication, redirect home.
      res.send("success");
    }
  );
  app.get("/success", (req: FastifyRequest, reply: FastifyReply) => {
    // Assuming you have an HTML file named "index.html" in the "public" directory
    const htmlFilePath = path.join(__dirname, "public", "success.html");

    // Read the HTML file content
    const htmlContent = fs.readFileSync(htmlFilePath, "utf-8");

    // Send the HTML content as the response
    reply.type("text/html").send(htmlContent);
  });
  return app;
};
// Create app instance using the helper function
const app = createApp();
export default app;
