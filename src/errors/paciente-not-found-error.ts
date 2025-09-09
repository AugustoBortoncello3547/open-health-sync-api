import { HttpStatusCodeEnum } from "../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error.js";

export class PacienteNotFoundError extends OpenHealthSyncBaseError {
  constructor() {
    super(`Paciente não encontrado.`, HttpStatusCodeEnum.NOT_FOUND);
    this.name = "PacienteNotFoundError";
  }
}
