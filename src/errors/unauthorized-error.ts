import { HttpStatusCodeEnum } from "../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error.js";

export class UnauthorizedError extends OpenHealthSyncBaseError {
  constructor(message: string) {
    super(message, HttpStatusCodeEnum.UNAUTHORIZED);
    this.name = "UnauthorizedError";
  }
}
