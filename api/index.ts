import { FastifyReply, FastifyRequest } from "fastify";
import { buildApp } from "../src";

export default async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const app = await buildApp();
    await app.ready();
    app.server.emit("request", req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
