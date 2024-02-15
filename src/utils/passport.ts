import fastifyPassport from "@fastify/passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { auth } from "../models";
import { FastifyRequest } from "fastify";
import { config } from "../config/config";

fastifyPassport.use(
  new GoogleStrategy(
    {
      clientID: config.env.passport.googleClientID,
      clientSecret: config.env.passport.googleClientSecret,
      callbackURL: config.env.passport.googleCallbackUrl,
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const email = profile.emails[0].value;
      console.log(accessToken);
      const googleId = profile.id;
      const name = profile.displayName;
      const userExist = await auth.login(email);
      if (userExist) {
        return done(null, userExist);
      }
      const result = await auth.registerSocial(name, email, googleId, null);
      if (result) {
        return done(null, profile);
      }
    }
  )
);

fastifyPassport.use(
  new FacebookStrategy(
    {
      clientID: "743845554359547",
      clientSecret: "743845554359547",
      callbackURL: "http://localhost:3000/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile, accessToken, refreshToken);
    }
  )
);
// Serialize user into the session
// register a serializer that stores the user object's id in the session ...
fastifyPassport.registerUserSerializer(async (user, req: FastifyRequest) => {
  const { id, displayName, username }: any = user;

  const userForSession = { id, displayName, username };
  return userForSession;
});

// ... and then a deserializer that will fetch that user from the database when a request with an id in the session arrives
fastifyPassport.registerUserDeserializer(async (userFromSession, request) => {
  return userFromSession;
});
