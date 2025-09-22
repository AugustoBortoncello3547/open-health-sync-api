import type { FastifyInstance } from "fastify";
import { createAmbienteRoute } from "./ambiente/create-ambiente-route.js";
import { deleteAmbienteRoute } from "./ambiente/delete-ambiente-route.js";
import { getAmbienteRoute } from "./ambiente/get-ambiente-route.js";
import { listAmbienteRoute } from "./ambiente/list-ambiente-route.js";
import { createAplicacaoRoute } from "./aplicacao/create-aplicacao-route.js";
import { getAplicacaoRoute } from "./aplicacao/get-aplicacao-route.js";
import { updateAplicacaoRoute } from "./aplicacao/update-aplicacao-route.js";
import { authRoute } from "./auth/auth-route.js";
import { createPacienteRoute } from "./paciente/create-paciente-route.js";
import { deletePacienteRoute } from "./paciente/delete-paciente-route.js";
import { getPacienteRoute } from "./paciente/get-paciente-route.js";
import { listPacienteRoute } from "./paciente/list-paciente-route.js";
import { createDadoSaudePacienteRoute } from "./dado-saude-paciente/create-dado-saude-paciente-route.js";
import { deleteDadoSaudePacienteRoute } from "./dado-saude-paciente/delete-dado-saude-paciente-route.js";

export function registerRoutes(app: FastifyInstance) {
  // Aplicacao
  app.register(createAplicacaoRoute);
  app.register(getAplicacaoRoute);
  app.register(updateAplicacaoRoute);

  // Auth
  app.register(authRoute);

  // Ambiente
  app.register(createAmbienteRoute);
  app.register(listAmbienteRoute);
  app.register(getAmbienteRoute);
  app.register(deleteAmbienteRoute);

  // Paciente
  app.register(createPacienteRoute);
  app.register(listPacienteRoute);
  app.register(getPacienteRoute);
  app.register(deletePacienteRoute);

  // Dado de saúde do paciente
  app.register(createDadoSaudePacienteRoute);
  app.register(deleteDadoSaudePacienteRoute);
}
