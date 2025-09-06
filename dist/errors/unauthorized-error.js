import { HttpStatusCodeEnum } from "../enums/http-status-code-enum";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error";
export class UnauthorizedError extends OpenHealthSyncBaseError {
    constructor(message) {
        super(message, HttpStatusCodeEnum.UNAUTHORIZED);
        this.name = "UnauthorizedError";
    }
}
//# sourceMappingURL=unauthorized-error.js.map