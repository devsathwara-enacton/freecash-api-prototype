import { providers } from "../models";
import { FastifyReply, FastifyRequest } from "fastify";
import app from "../app";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await providers.fetch();
  if (result) {
    return reply
      .status(200)
      .send({ success: true, data: result, error: null, msg: null });
  } else {
    return reply.callNotFound;
  }
};
