import * as dotenv from "dotenv";
dotenv.config();

import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import { app } from "../src/app.js";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

const fastify = Fastify({
  logger: true,
  disableRequestLogging: true,
}).withTypeProvider<ZodTypeProvider>();

fastify.register(app);

export default async (req: FastifyRequest, res: FastifyReply) => {
  try {
    await fastify.ready();
    fastify.server.emit("request", req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
