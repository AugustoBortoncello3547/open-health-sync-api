import type { FastifyInstance, FastifyServerOptions } from "fastify";
import { MongoClient } from "./database/mongo.js";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { registerRoutes } from "./routes";
import { notFoundErrorHandlerHook } from "./hooks/not-found-error-handler-hook";
import { globalErrorHandlerHook } from "./hooks/global-error-handler-hook";

export async function app(app: FastifyInstance, _: FastifyServerOptions) {
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
}
