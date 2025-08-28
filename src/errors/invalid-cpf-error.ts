import { HttpStatusCode } from "../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error.js";

export class InvalidCpfError extends OpenHealthSyncBaseError {
  constructor() {
    super("CPF informado não é válido.", HttpStatusCode.BAD_REQUEST);
    this.name = "InvalidCpfError";
  }
}
