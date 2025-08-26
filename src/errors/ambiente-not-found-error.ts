import { HttpStatusCode } from "../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error.js";

export class AmbienteNotFoundError extends OpenHealthSyncBaseError {
  constructor() {
    super(`Ambiente não encontrado.`, HttpStatusCode.NOT_FOUND);
    this.name = "AmbienteNotFoundError";
  }
}
