import dotenv from "dotenv";
import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";

dotenv.config();

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });

const port = process.env.PORT || 3333;
app.listen({ port: port }).then(() => {
  console.log("HTTP Server is runnig");
});
