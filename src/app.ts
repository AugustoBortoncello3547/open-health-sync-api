import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { MongoClient } from "./database/mongo.js";
import { registerRoutes } from "./routes/index.js";
import { globalErrorHandlerHook } from "./hooks/global-error-handler-hook.js";
import { notFoundErrorHandlerHook } from "./hooks/not-found-error-handler-hook.js";
import type { FastifyInstance, FastifyServerOptions } from "fastify";

async function app(instance: FastifyInstance, _: FastifyServerOptions) {
  // Conexão com o MongoDB
  const mongoDBClient = MongoClient.getInstance();
  await mongoDBClient.connect();

  // Compiladores do Zod
  instance.setValidatorCompiler(validatorCompiler);
  instance.setSerializerCompiler(serializerCompiler);

  // Plugins
  instance.register(fastifyCors, { origin: "*" });
  instance.register(fastifySwagger, {
    openapi: {
      info: { title: "Open Health Sync API", version: "1.0.0" },
      components: {
        securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
      },
    },
    transform: jsonSchemaTransform,
  });
  instance.register(fastifySwaggerUi, { routePrefix: "/docs" });

  // Rotas reais
  const apiVersion = process.env.API_VERSION || "v1";
  instance.register(registerRoutes, { prefix: apiVersion });

  // Hooks de erro
  instance.setNotFoundHandler(notFoundErrorHandlerHook);
  instance.setErrorHandler(globalErrorHandlerHook);
}

export default app;
