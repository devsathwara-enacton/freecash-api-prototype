import { FastifyInstance } from "fastify";
import { postbackController } from "../controllers";
import { postbackSchema } from "../schema/postSchema";

export default async function (app: FastifyInstance) {
  app.get("/", { schema: postbackSchema }, postbackController.validate);
}
