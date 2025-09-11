import { HttpStatusCodeEnum } from "../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error.js";

export class AmbienteWithPacientesError extends OpenHealthSyncBaseError {
  constructor() {
    super(
      `Não é possível excluir este ambiente porque ainda há pacientes vinculados a ele. Exclua os pacientes antes de prosseguir.`,
      HttpStatusCodeEnum.NOT_FOUND,
    );
    this.name = "AmbienteWithPacientesError";
  }
}
