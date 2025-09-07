import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance, FastifyServerOptions } from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { globalErrorHandlerHook } from "./hooks/global-error-handler-hook.js";
import { notFoundErrorHandlerHook } from "./hooks/not-found-error-handler-hook.js";
import { registerRoutes } from "./routes/index.js";

export default async function app(app: FastifyInstance, _: FastifyServerOptions) {
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
