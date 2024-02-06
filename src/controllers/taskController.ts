import { FastifyReply, FastifyRequest } from "fastify";
import { task } from "../models";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const {
    countries,
    page_number,
    limit,
    platform,
    featured,
    network,
    category,
  } = req.query as {
    countries: string[];
    page_number: number;
    limit: number;
    platform: string[];
    featured: boolean;
    network: string;
    category: number;
  };
  console.log(
    countries,
    page_number,
    limit,
    platform,
    featured,
    network,
    category
  );
  const result = await task.fetch(
    typeof countries != undefined || !countries ? countries : null,
    page_number || null,
    limit != null ? parseInt(limit.toString()) : limit,
    typeof platform != undefined || !platform ? platform : null,
    featured != null || featured != undefined ? featured : null,
    network || null,
    category || null
  );

  if (!result) {
    return reply.status(404).send({
      error: "Not Found",
    });
  } else {
    return reply.send({
      success: 1,
      data: {
        tasks: result.rows.map((task: any) => ({
          name: task.Name ? JSON.parse(task.Name)?.en || null : null,
          description: task.description
            ? JSON.parse(task.description)?.en || null
            : null,
          instructions: task.instructions
            ? JSON.parse(task.instructions)?.en || null
            : null,
          id: task.ID,
          network: task.network,
          offer_id: task.offer_id,
          category_id: task.category_id,
          image: task.image,
          url: task.url,
          payout: task.payout,
          countries: task.countries ? JSON.parse(task.countries) : null,
          platforms: task.platforms ? JSON.parse(task.platforms) : null,
          status: task.status,
          is_featured: task.is_featured,
          goals_count: task.goals_count,
          goals: task.network_goals ? JSON.parse(task.network_goals) : null,
          provider: {
            code: task.code,
            name: task.network,
            icon: task.icon,
          },
          category: {
            name: task.name,
            id: task.category_id,
            icon: task.icon || null,
            bg_color: task.bg_color,
            sort_order: task.sort_order,
          },
        })),
      },
      error: 0,
      msg: null,
    });
  }
};
