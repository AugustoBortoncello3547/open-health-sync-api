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
import { registerRoutes } from "./routes/index.js";
import { MongoClient } from "./database/mongo.js";

async function startServer() {
  dotenv.config();

  const app = fastify().withTypeProvider<ZodTypeProvider>();

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

  app.register(registerRoutes);

  const port = process.env.PORT || 3333;
  app.listen({ port: port }).then(() => {
    console.log("HTTP Server is runnig");
  });
}

startServer();
