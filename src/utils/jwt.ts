import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { FastifyReply } from "fastify";

const secret = config.env.app.secret;

export function createJWTToken(data: any, expiresIn: any) {
  if (!secret) {
    throw new Error("JWT Secret is not defined");
  }

  return jwt.sign(data, secret, { expiresIn: expiresIn });
}

export function validateJWTToken(token: any) {
  if (!secret) {
    throw new Error("JWT Secret is not defined");
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.log(err);
  }
}

export function decodeToken(reply: FastifyReply, token: any) {
  const decoded: any = validateJWTToken(token);

  // Check if the token is expired
  if (decoded.exp <= Date.now() / 1000) {
    return reply.status(400).send({ error: "Token Expired" });
  }
  return decoded;
}
