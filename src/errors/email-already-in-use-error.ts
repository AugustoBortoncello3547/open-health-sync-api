import { HttpStatusCode } from "../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error.js";

export class EmailAlreadyInUseError extends OpenHealthSyncBaseError {
  constructor() {
    super(`Este email já está sendo usado por outra aplicação.`, HttpStatusCode.CONFLICT);
    this.name = "EmailAlreadyInUseError";
  }
}
