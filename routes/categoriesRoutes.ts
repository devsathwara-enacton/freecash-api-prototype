import { FastifyInstance } from "fastify";
import { categoriesController } from "../controllers";
const fetchCategorySchema = {
  tags: ["Categories"],
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        data: {
          type: "object",
          properties: {
            Categories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" },
                  icon: { type: "string" },
                  bg_color: { type: "string" },
                  sort_order: { type: "integer" },
                },
              },
            },
          },
        },
        error: { type: "number" },
        msg: { type: ["null", "string"] },
      },
    },
  },
};
export default async function (app: FastifyInstance) {
  app.get("/", { schema: fetchCategorySchema }, categoriesController.fetch);
}
