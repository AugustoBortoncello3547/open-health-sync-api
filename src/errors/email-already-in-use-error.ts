import { HttpStatusCodeEnum } from "../enums/http-status-code-enum";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error";

export class EmailAlreadyInUseError extends OpenHealthSyncBaseError {
  constructor() {
    super(`Este email já está sendo usado por outra aplicação.`, HttpStatusCodeEnum.CONFLICT);
    this.name = "EmailAlreadyInUseError";
  }
}
