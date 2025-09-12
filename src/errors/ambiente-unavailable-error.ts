import { HttpStatusCodeEnum } from "../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error.js";

export class AmbienteUnavailableError extends OpenHealthSyncBaseError {
  constructor() {
    super(`Ambiente não se encontra ativo.`, HttpStatusCodeEnum.FORBIDDEN);
    this.name = "AmbienteUnavailableError";
  }
}
