import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { taskController } from "../controllers";
import { isAuthenticated } from "../middleware/authMiddleware";
import { fetchTaskSchema } from "../schema/taskSchemas";
export default async function (app: FastifyInstance) {
  app.get("/", { schema: fetchTaskSchema }, taskController.fetch);
}
