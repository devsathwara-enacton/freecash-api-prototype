import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fastifyPassport from "@fastify/passport";
import { authController } from "../controllers";
import { loginUserSchema, registerUserSchema } from "../schema/authSchema";
import { isAuthenticated } from "../middleware/authMiddleware";

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
      reply.clearCookie("accessToken");
      req.session.delete();
      req.logout();
      return reply.view("login.ejs", {
        message: "Logout Successfull",
        warning: null,
      });
    }
  );
  app.get(
    "/verify-email/",
    {
      schema: {
        querystring: {
          token: { type: "string" },
        },
      },
    },
    authController.verifyEmail
  );

  app.post(
    "/forgot-password",
    {
      schema: {
        body: {
          email: {
            type: "string",
            format: "email",
          },
        },
      },
    },
    authController.forgotPassword
  );
  app.post(
    "/reset-password/",
    // {
    //   schema: {
    //     body: {
    //       password: {
    //         type: "string",
    //         minLength: 6,
    //         // Regular expression pattern for at least 1 uppercase letter, 1 lowercase letter, and 1 digit
    //         pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$",
    //       },
    //     },
    //   },
    // },
    authController.resetPassword
  );
  app.post(
    "/change-password",
    {
      preHandler: isAuthenticated,
      // schema: {
      //   body: {
      //     currentpassword: {
      //       type: "string",
      //       minLength: 6,
      //       // Regular expression pattern for at least 1 uppercase letter, 1 lowercase letter, and 1 digit
      //       pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$",
      //     },
      //     password: {
      //       type: "string",
      //       minLength: 6,
      //       // Regular expression pattern for at least 1 uppercase letter, 1 lowercase letter, and 1 digit
      //       pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$",
      //     },
      //   },
      // },
    },
    authController.changePassword
  );
}
