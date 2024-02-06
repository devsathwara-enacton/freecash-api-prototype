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
import useragent from "useragent";
// Extend FastifyInstance to include the 'db' property
interface CustomFastifyInstance extends FastifyInstance {
  db: Kysely<DB>;
}

// Helper function to create app instance
const createApp = (): CustomFastifyInstance => {
  const app = fastify({ logger: true }) as unknown as CustomFastifyInstance;
  app.decorate("db", db);
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
      let newAccessToken = Math.floor(Math.random() * 10);
      req.session.set("accessToken", newAccessToken);
      reply.redirect("/success");
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
      req.session.set("accessToken", newAccessToken);
      reply.redirect("/success");
    }
  );
  app.get("/success", (req: FastifyRequest, reply: FastifyReply) => {
    // Render the "index.ejs" template
    const accessToken = req.session.get("accessToken");
    console.log(accessToken);
    reply.send({
      /* optional template context */
      accessToken: accessToken,
    });
  });
  app.get(
    "/api/v1/auth/check-device",
    (req: FastifyRequest, reply: FastifyReply) => {
      var agent: useragent.Agent = useragent.parse(req.headers["user-agent"]);
      var agent2 = useragent.lookup(req.headers["user-agent"]);
      var ua = useragent.is(req.headers["user-agent"]);
      console.log(ua, agent);
    }
  );
  return app;
};
// Create app instance using the helper function
const app = createApp();
export default app;
