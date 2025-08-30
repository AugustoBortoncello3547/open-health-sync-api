import type { FastifyInstance } from "fastify";
import { createAmbienteRoute } from "./ambiente/create-ambiente-route.js";
import { deleteAmbienteRoute } from "./ambiente/delete-ambiente-route.js";
import { getAmbienteRoute } from "./ambiente/get-ambiente-route.js";
import { createAplicacaoRoute } from "./aplicacao/create-aplicacao-route.js";
import { getAplicacaoRoute } from "./aplicacao/get-aplicacao-route.js";
import { updateAplicacaoRoute } from "./aplicacao/update-aplicacao-route.js";
import { authRoute } from "./auth/auth-route.js";

export function registerRoutes(app: FastifyInstance) {
  // Aplicacao
  app.register(createAplicacaoRoute);
  app.register(updateAplicacaoRoute);
  app.register(getAplicacaoRoute);

  // Auth
  app.register(authRoute);

  // Ambiente
  app.register(createAmbienteRoute);
  app.register(getAmbienteRoute);
  app.register(deleteAmbienteRoute);
}
