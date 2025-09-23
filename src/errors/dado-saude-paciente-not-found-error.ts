import { HttpStatusCodeEnum } from "../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error.js";

export class DadoSaudePacienteNotFoundError extends OpenHealthSyncBaseError {
  constructor() {
    super(`Dado de saúde do paciente não encontrado.`, HttpStatusCodeEnum.NOT_FOUND);
    this.name = "DadoSaudePacienteNotFoundError";
  }
}
