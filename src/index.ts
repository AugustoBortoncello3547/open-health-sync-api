import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import dotenv from "dotenv";
import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { MongoClient } from "./database/mongo";
import { globalErrorHandlerHook } from "./hooks/global-error-handler-hook";
import { notFoundErrorHandlerHook } from "./hooks/not-found-error-handler-hook";
import { registerRoutes } from "./routes/index";

async function startServer() {
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

  const port = process.env.PORT || 3333;
  app.listen({ port: port }).then(() => {
    console.log("HTTP Server is runnig...");
  });

  // Shutdown mais seguro
  const listeners = ["SIGINT", "SIGTERM"];
  listeners.forEach((signal) => {
    process.on(signal, async () => {
      console.log("HTTP Server shuting down...");
      await app.close();
      await mongoDBClient.disconnect();
      process.exit(0);
    });
  });
}

startServer();
