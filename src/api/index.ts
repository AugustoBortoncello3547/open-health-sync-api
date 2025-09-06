import fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import dotenv from "dotenv";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { MongoClient } from "../database/mongo";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { registerRoutes } from "../routes";
import { notFoundErrorHandlerHook } from "../hooks/not-found-error-handler-hook";
import { globalErrorHandlerHook } from "../hooks/global-error-handler-hook";

async function buildApp() {
  dotenv.config();

  const app = fastify({
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

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifyCors, { origin: "*" });
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Open Health Sync API",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  const apiVersion = process.env.API_VERSION || "v1";
  app.register(registerRoutes, { prefix: apiVersion });

  app.setNotFoundHandler(notFoundErrorHandlerHook);
  app.setErrorHandler(globalErrorHandlerHook);

  return app;
}

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
