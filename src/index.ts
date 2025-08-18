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
import { mainApiErrorHandler } from "./controllers/errors/main-api-error-handler.js";
import { MongoClient } from "./database/mongo.js";
import { registerRoutes } from "./routes/index.js";

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

  const client = MongoClient.getInstance();
  await client.connect();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifyCors, { origin: "*" });
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Open Health Sync API",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  const apiVersion = process.env.API_VERSION || "v1";
  app.register(registerRoutes, { prefix: apiVersion });

  app.setErrorHandler(mainApiErrorHandler);

  const port = process.env.PORT || 3333;
  app.listen({ port: port }).then(() => {
    console.log("HTTP Server is runnig");
  });
}

startServer();
