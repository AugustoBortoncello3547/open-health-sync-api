import { HttpStatusCodeEnum } from "../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error.js";

export class DadoSaudePacienteWithIdExternoAlreadyInUseError extends OpenHealthSyncBaseError {
  constructor() {
    super(`Já existe um dado de saúde do paciente com esse idExterno cadastrado.`, HttpStatusCodeEnum.CONFLICT);
    this.name = "DadoSaudePacienteWithIdExternoAlreadyInUseError";
  }
}
