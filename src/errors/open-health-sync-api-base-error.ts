export class OpenHealthSyncBaseError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 500, name?: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = name ?? this.constructor.name;
  }
}
