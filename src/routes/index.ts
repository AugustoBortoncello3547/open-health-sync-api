import type { FastifyInstance } from "fastify";
import { createAplicacaoRoute } from "./aplicacao/create-aplicacao-route.js";
import { getAplicacaoRoute } from "./aplicacao/get-aplicacao-route.js";
import { authRoute } from "./auth/auth-route.js";

export function registerRoutes(app: FastifyInstance) {
  // Aplicacao
  app.register(createAplicacaoRoute);
  app.register(getAplicacaoRoute);

  // Auth
  app.register(authRoute);
}
