import dotenv from "dotenv";
import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { aplicacaoRoutes } from "./routes/AplicacaoRoutes.js";

dotenv.config();

const app = fastify();

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
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(aplicacaoRoutes);

const port = process.env.PORT || 3333;
app.listen({ port: port }).then(() => {
  console.log("HTTP Server is runnig");
});
