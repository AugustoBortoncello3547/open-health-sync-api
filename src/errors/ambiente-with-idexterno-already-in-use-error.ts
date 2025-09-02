import { HttpStatusCodeEnum } from "../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error.js";

export class AmbienteWithIdExternoAlreadyInUseError extends OpenHealthSyncBaseError {
  constructor() {
    super(`Já existe um ambiente com esse idExterno cadastrado.`, HttpStatusCodeEnum.CONFLICT);
    this.name = "AmbienteWithIdExternoAlreadyInUseError";
  }
}
