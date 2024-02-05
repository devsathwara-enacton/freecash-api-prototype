import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fastifyPassport from "@fastify/passport";
import { authController } from "../controllers";

export default async function (app: FastifyInstance) {
  app.get(
    "/google",
    {
      preValidation: fastifyPassport.authenticate("google", {
        scope: ["profile", "email"],
      }),
    },
    async () => {
      console.log("GOOGLE API forward");
    }
  );
  app.get(
    "/login/facebook",
    {
      preValidation: fastifyPassport.authenticate("facebook", {
        scope: ["profile", "email"],
      }),
    },
    async () => {
      console.log("GOOGLE API forward");
    }
  );
  app.post("/register", authController.register);
  app.post("/login", authController.login);
  app.get("/logout", (req: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie("email");
    req.session.delete();
    req.logout();
    return reply.send("Logout success");
  });
}
