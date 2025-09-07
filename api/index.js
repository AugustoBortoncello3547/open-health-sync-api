import * as dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import app from "../dist/src/app";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  disableRequestLogging: true,
});

fastify.register(app);

export default async (req, res) => {
  try {
    await fastify.ready();
    fastify.server.emit("request", req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
