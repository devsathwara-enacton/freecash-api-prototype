import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fastifyPassport from "@fastify/passport";
import { authController } from "../controllers";
import { loginUserSchema, registerUserSchema } from "../schema/authSchema";

export default async function (app: FastifyInstance) {
  app.get(
    "/google",
    {
      preValidation: fastifyPassport.authenticate("google", {
        scope: ["profile", "email"],
      }),
      schema: { tags: ["Authentication"] },
    },
    async () => {
      console.log("GOOGLE API forward");
    }
  );
  app.get(
    "/facebook",
    {
      preValidation: fastifyPassport.authenticate("facebook", {
        scope: ["profile", "email"],
      }),
      schema: { tags: ["Authentication"] },
    },
    async () => {
      console.log("GOOGLE API forward");
    }
  );
  app.post(
    "/register",
    { schema: registerUserSchema },
    authController.register
  );
  app.post("/login", { schema: loginUserSchema }, authController.login);
  app.get(
    "/logout",
    { schema: { tags: ["Authentication"] } },
    (req: FastifyRequest, reply: FastifyReply) => {
      reply.clearCookie("email");
      req.session.delete();
      req.logout();
      return reply.send("Logout success");
    }
  );
}
