import { HttpStatusCodeEnum } from "../enums/http-status-code-enum";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error";
export class InvalidCpfError extends OpenHealthSyncBaseError {
    constructor() {
        super("CPF informado não é válido.", HttpStatusCodeEnum.BAD_REQUEST);
        this.name = "InvalidCpfError";
    }
}
//# sourceMappingURL=invalid-cpf-error.js.map