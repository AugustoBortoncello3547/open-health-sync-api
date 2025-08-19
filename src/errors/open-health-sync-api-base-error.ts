import { HttpStatusCode } from "../enums/http-status-code-enum.js";

export class OpenHealthSyncBaseError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR, name?: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = name ?? this.constructor.name;
  }
}
