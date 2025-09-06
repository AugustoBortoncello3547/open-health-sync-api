import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import dotenv from "dotenv";
import { fastify, type FastifyReply, type FastifyRequest } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { MongoClient } from "./database/mongo.js";
import { AmbienteApiEnum } from "./enums/ambiente-api-enum.js";
import { globalErrorHandlerHook } from "./hooks/global-error-handler-hook.js";
import { notFoundErrorHandlerHook } from "./hooks/not-found-error-handler-hook.js";
import { registerRoutes } from "./routes/index.js";

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

const isLocalEnvironment = process.env.AMBIENTE === AmbienteApiEnum.LOCAL;
if (isLocalEnvironment) {
  buildApp().then((app) => {
    const port = process.env.PORT || 3333;
    app.listen({ port: port }).then(() => {
      console.log("HTTP Server is runnig...");
    });
  });
}

// Handler para a vercel
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
