import fastify, { FastifyInstance } from "fastify";
import { db } from "./database/database";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen/dist/db";

// Extend FastifyInstance to include the 'db' property
interface CustomFastifyInstance extends FastifyInstance {
  db: Kysely<DB>;
}

// Helper function to create app instance
const createApp = (): CustomFastifyInstance => {
  const app = fastify({ logger: true }) as unknown as CustomFastifyInstance;
  app.decorate("db", db);
  app.register(require("fastify-healthcheck"));
  // app.setErrorHandler((error, request, reply) => {
  //   console.log(error.toString());
  //   reply.status(Number(error.statusCode)).send({ error: error });
  // });
  app.register(import("./routes/taskRoutes"), { prefix: "/api/v1/task" });
  return app;
};
// Create app instance using the helper function
const app = createApp();
export default app;
