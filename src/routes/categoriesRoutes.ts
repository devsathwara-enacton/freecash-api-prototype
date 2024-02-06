import { FastifyInstance } from "fastify";
import { categoriesController } from "../controllers";
import { fetchCategorySchema } from "../schema/categoriesSchema";

export default async function (app: FastifyInstance) {
  app.get("/", { schema: fetchCategorySchema }, categoriesController.fetch);
}
