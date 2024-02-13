import { FastifyReply, FastifyRequest } from "fastify";
import { decodeToken } from "../utils/jwt";
import { auth } from "../models";

export const isAuthenticated = async (
  req: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return reply.status(401).send({ error: "Not authenticated" });
  }
  const decoded = decodeToken(reply, accessToken);
  const userExist = await auth.login(decoded.email);
  console.log("Access Token:", accessToken);
  if (!userExist) {
    return reply.status(403).send({ error: "User not found" });
  } else {
    done();
  }
};
