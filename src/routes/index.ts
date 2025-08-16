import type { FastifyInstance } from "fastify";
import { createAplicacaoRoute } from "./aplicacao/create-aplicacao-route.js";

export function registerRoutes(app: FastifyInstance) {
  // Aplicacao
  app.register(createAplicacaoRoute);
}
