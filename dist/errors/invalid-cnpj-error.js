import { HttpStatusCodeEnum } from "../enums/http-status-code-enum";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error";
export class InvalidCnpjError extends OpenHealthSyncBaseError {
    constructor() {
        super("CNPJ informado não é válido.", HttpStatusCodeEnum.BAD_REQUEST);
        this.name = "InvalidCnpjError";
    }
}
//# sourceMappingURL=invalid-cnpj-error.js.map