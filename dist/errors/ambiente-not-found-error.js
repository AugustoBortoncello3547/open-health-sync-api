import { HttpStatusCodeEnum } from "../enums/http-status-code-enum";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error";
export class AmbienteNotFoundError extends OpenHealthSyncBaseError {
    constructor() {
        super(`Ambiente não encontrado.`, HttpStatusCodeEnum.NOT_FOUND);
        this.name = "AmbienteNotFoundError";
    }
}
//# sourceMappingURL=ambiente-not-found-error.js.map