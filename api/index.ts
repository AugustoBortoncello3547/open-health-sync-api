import * as dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import app from "../src/app.js";

const fastify = Fastify({
  logger: true,
  disableRequestLogging: true,
}).withTypeProvider<ZodTypeProvider>();

fastify.register(app);

const readyPromise = fastify.ready();

export default async (req: any, res: any) => {
  try {
    await readyPromise;
    fastify.server.emit("request", req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
