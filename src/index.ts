import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { AmbienteApiEnum } from "./enums/ambiente-api-enum.js";
import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import app from "./app.js";

// Só roda local se estiver no ambiente LOCAL
const isLocalEnvironment = process.env.AMBIENTE === AmbienteApiEnum.LOCAL;

if (isLocalEnvironment) {
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

  fastify.register(app, { prefix: "/" });

  const port = process.env.PORT || 3333;
  fastify.listen({ port }).then(() => console.log(`Serverless app running locally at http://localhost:${port}`));
}
