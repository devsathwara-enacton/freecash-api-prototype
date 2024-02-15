import { categories } from "../models";
import { FastifyReply, FastifyRequest } from "fastify";
import app from "../app";
export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await categories.fetch();
  if (result) {
    return reply.status(200).send({
      success: true,
      data: {
        Categories: result.map((i: any) => ({
          id: i.id,
          name: i.name ? JSON.parse(i.name)?.en || null : null,
          icon: i.icon,
          bg_color: i.bg_color,
          sort_order: i.sort_order,
        })),
      },
      error: null,
      msg: null,
    });
  } else {
    return reply.callNotFound;
  }
};
