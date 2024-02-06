import { FastifyInstance } from "fastify";
import { providersController } from "../controllers";

export default async function (app: FastifyInstance) {
  app.get("/", { schema: { tags: ["Providers"] } }, providersController.fetch);
}
