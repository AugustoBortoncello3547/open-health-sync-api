import { HttpStatusCodeEnum } from "../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error.js";

export class InvalidCnpjError extends OpenHealthSyncBaseError {
  constructor() {
    super("CNPJ informado não é válido.", HttpStatusCodeEnum.BAD_REQUEST);
    this.name = "InvalidCnpjError";
  }
}
