import fastify, { FastifyInstance } from "fastify";
import { db } from "./database/database";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { swaggerOptions, swaggerUiOptions } from "./utils/swagger";

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
  app.register(fastifySwagger, swaggerOptions);
  app.register(fastifySwaggerUi, swaggerUiOptions);

  app.register(import("./routes/taskRoutes"), { prefix: "/api/v1/task" });
  app.register(import("./routes/providersRoutes"), {
    prefix: "/api/v1/offer-providers",
  });
  app.register(import("./routes/postbackRoutes"), {
    prefix: "/api/v1/postback",
  });
  app.register(import("./routes/categoriesRoutes"), {
    prefix: "/api/v1/offer-categories",
  });
  return app;
};
// Create app instance using the helper function
const app = createApp();
export default app;
