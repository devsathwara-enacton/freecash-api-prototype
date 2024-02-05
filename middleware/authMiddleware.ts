import { FastifyReply, FastifyRequest } from "fastify";

export const isAuthenticated = (
  req: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) => {
  const accessToken = req.session.get("accessToken");
  console.log("Access Token:", accessToken);
  if (!accessToken) {
    return reply.status(401).send({ error: "Not authenticated" });
  } else {
    done();
  }
};
