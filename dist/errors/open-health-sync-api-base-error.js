import { HttpStatusCodeEnum } from "../enums/http-status-code-enum";
export class OpenHealthSyncBaseError extends Error {
    statusCode;
    constructor(message, statusCode = HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, name) {
        super(message);
        this.statusCode = statusCode;
        this.name = name ?? this.constructor.name;
    }
}
//# sourceMappingURL=open-health-sync-api-base-error.js.map