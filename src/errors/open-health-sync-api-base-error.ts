import { HttpStatusCodeEnum } from "../enums/http-status-code-enum";

export class OpenHealthSyncBaseError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, name?: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = name ?? this.constructor.name;
  }
}
