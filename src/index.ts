import Fastify from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import app from "./app.js";
import { MongoClient } from "./database/mongo.js";
import { AmbienteApiEnum } from "./enums/ambiente-api-enum.js";

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
}).withTypeProvider<ZodTypeProvider>();

const mongoDBClient = MongoClient.getInstance();
await mongoDBClient.connect();

fastify.register(app);

const isLocalEnvironment = process.env.AMBIENTE === AmbienteApiEnum.LOCAL;
if (isLocalEnvironment) {
  const port = process.env.PORT || 3333;
  fastify.listen({ port: port }).then(() => {
    console.log("HTTP Server is runnig...");
  });
}
