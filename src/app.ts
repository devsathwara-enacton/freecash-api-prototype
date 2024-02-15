import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { db } from "./database/database";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { swaggerOptions, swaggerUiOptions } from "./utils/swagger";
import fastifyCookie from "@fastify/cookie";
import fastifySecureSession from "@fastify/secure-session";
import fastifyPassport from "@fastify/passport";
import "./utils/passport";
import cors from "@fastify/cors";
import { config } from "./config/config";
import axios from "axios";
// Extend FastifyInstance to include the 'db' property
interface CustomFastifyInstance extends FastifyInstance {
  db: Kysely<DB>;
}

// Helper function to create app instance
const createApp = (): CustomFastifyInstance => {
  const app = fastify({ logger: true }) as unknown as CustomFastifyInstance;
  app.decorate("db", db);
  const sessionSecret = config.env.app.sessionSecret?.toString();
  if (!sessionSecret) {
    throw new Error("Session secret is not defined in the config");
  }
  const sessionSalt = config.env.app.sessionSalt?.toString();
  if (!sessionSalt) {
    throw new Error("Session salt is not defined in the config");
  }
  app.register(require("fastify-healthcheck"));
  app.setErrorHandler(
    (error: Error, request: FastifyRequest, reply: FastifyReply) => {
      console.log(error.toString());
      reply.send({ error: error });
    }
  );
  app.register(cors);
  app.register(fastifyCookie);

  app.register(fastifySecureSession, {
    secret: sessionSecret,
    salt: sessionSalt,
    sessionName: config.env.app.sessionName,
    cookieName: config.env.app.cookieName,
    cookie: {
      path: "/",
      httpOnly: false,
      expires: new Date(Date.now() + 3600000),
      sameSite: "none",
      secure: true,
      // domain: ".enactweb.com",
    },
  });
  // app.register(require("@fastify/flash"));
  app.register(fastifyPassport.initialize());
  app.register(fastifyPassport.secureSession());
  app.register(fastifySwagger, swaggerOptions);
  app.register(fastifySwaggerUi, swaggerUiOptions);

  app.register(import("./routes/taskRoutes"), { prefix: "/api/v1/task" });
  app.register(import("./routes/authRoutes"), { prefix: "/api/v1/auth" });
  app.register(import("./routes/providersRoutes"), {
    prefix: "/api/v1/offer-providers",
  });
  app.register(import("./routes/postbackRoutes"), {
    prefix: "/api/v1/postback",
  });
  app.register(import("./routes/categoriesRoutes"), {
    prefix: "/api/v1/offer-categories",
  });
  // app.get(
  //   "/auth/google/callback",
  //   {
  //     preValidation: fastifyPassport.authenticate("google", {
  //       scope: ["profile", "email"],
  //       state: "sds3sddd",
  //       failureRedirect: "/",
  //     }),
  //   },
  //   async (req: FastifyRequest, reply: FastifyReply) => {
  //     const { code } = req.query as { code: string };
  //     console.log(req.query);
  //     const url = "https://oauth2.googleapis.com/token";
  //     const grantType = "authorization_code";
  //     const params = new URLSearchParams();
  //     params.append("client_id", config.env.passport.googleClientID);
  //     params.append("client_secret", config.env.passport.googleClientSecret);
  //     params.append("code", code);
  //     params.append("grant_type", grantType);
  //     params.append(
  //       "redirect_uri",
  //       config.env.passport.googleCallbackUrl ?? ""
  //     );

  //     fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: params,
  //     })
  //       .then((response) => response.json())
  //       .then((data) => console.log(data))
  //       .catch((error) => console.error("Error:", error));
  //     let accessToken = await createJWTToken(
  //       { user: req.user },
  //       `${parseInt(config.env.app.expiresIn)}h`
  //     );
  //     reply.setCookie("accessToken", accessToken.toString(), {
  //       path: "/",
  //       httpOnly: false,
  //       expires: new Date(Date.now() + 3600000),
  //       sameSite: "none",
  //       secure: true,
  //       domain: ".enactweb.com",
  //     });
  //     reply.send({ success: "true" });
  //   }
  // );
  app.get("/auth/google/callback", async (req, res) => {
    try {
      const { code } = req.query as { code: string };

      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: code,
          client_id: config.env.passport.googleClientID,
          client_secret: config.env.passport.googleClientSecret,
          redirect_uri: config.env.passport.googleCallbackUrl ?? "",
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenResponse.json();

      // log full token response
      console.log(tokenData);

      if (tokenResponse.ok) {
        const profile = await fetchUserProfile(tokenData.access_token);
        // return access token
        return res.send({
          profile: profile,
        });
      } else {
        // handle error
        return res.status(500).send({
          error: tokenData.error,
        });
      }
    } catch (err) {
      // log any errors
      console.error(err);
      return res.status(500).send({
        error: "Error exchanging code for access token",
      });
    }
  });

  app.get(
    "/auth/facebook/callback",
    {
      preHandler: fastifyPassport.authenticate("facebook", {
        failureRedirect: "/login",
      }),
    },
    function (req: FastifyRequest, reply: FastifyReply) {
      let newAccessToken = Math.floor(Math.random() * 10);
      reply.setCookie("accessToken", newAccessToken.toString(), {
        path: "/",
        httpOnly: false,
        expires: new Date(Date.now() + 3600000),
        sameSite: "none",
        secure: true,
        domain: ".enactweb.com",
      });
      reply.send({ success: "true" });
    }
  );
  return app;
};
async function fetchUserProfile(accessToken: any) {
  try {
    // Make a GET request to the Google People API's user info endpoint
    const response = await axios.get(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
        },
      }
    ); // Extract relevant user information from the response

    const profile = response.data; // console.log(profile);
    return profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
// Create app instance using the helper function
const app: CustomFastifyInstance = createApp();
export default app;
