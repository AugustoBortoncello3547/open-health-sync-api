import { HttpStatusCode } from "../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error.js";

export class AplicacaoNaoEncontradaError extends OpenHealthSyncBaseError {
  constructor() {
    super(`Aplicação não encontrada.`, HttpStatusCode.NOT_FOUND);
    this.name = "AplicacaoNaoEncontradaError";
  }
}
