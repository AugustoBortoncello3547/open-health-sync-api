import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import dotenv from "dotenv";
import { fastify, type FastifyInstance } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { MongoClient } from "./database/mongo.js";
import { globalErrorHandlerHook } from "./hooks/global-error-handler-hook.js";
import { notFoundErrorHandlerHook } from "./hooks/not-found-error-handler-hook.js";
import { registerRoutes } from "./routes/index.js";

export async function buildApp(): Promise<FastifyInstance> {
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
    disableRequestLogging: process.env.NODE_ENV === "production",
    trustProxy: true, // Importante para o Vercel
  }).withTypeProvider<ZodTypeProvider>();

  // Conecta ao MongoDB apenas se não estiver conectado
  const mongoDBClient = MongoClient.getInstance();
  await mongoDBClient.connect();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifyCors, {
    origin: "*",
  });

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

  // Health check endpoint
  app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  const apiVersion = process.env.API_VERSION || "v1";
  app.register(registerRoutes, { prefix: `/${apiVersion}` });

  app.setNotFoundHandler(notFoundErrorHandlerHook);
  app.setErrorHandler(globalErrorHandlerHook);

  return app;
}
