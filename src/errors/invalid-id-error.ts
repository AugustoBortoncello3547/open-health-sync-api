import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error.js";

export class InvalidIdError extends OpenHealthSyncBaseError {
  constructor() {
    super(`O id informado não é válido.`, 400);
    this.name = "InvalidIdError";
  }
}
