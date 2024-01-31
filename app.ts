import fastify, { FastifyInstance } from "fastify";
const app: FastifyInstance = fastify({ logger: true });

app.register(require("fastify-healthcheck"));

export default app;
