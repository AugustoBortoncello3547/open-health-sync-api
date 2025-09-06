import { HttpStatusCodeEnum } from "../enums/http-status-code-enum";
import { OpenHealthSyncBaseError } from "./open-health-sync-api-base-error";
export class AplicacaoNotFoundError extends OpenHealthSyncBaseError {
    constructor() {
        super(`Aplicação não encontrada.`, HttpStatusCodeEnum.NOT_FOUND);
        this.name = "AplicacaoNotFoundError";
    }
}
//# sourceMappingURL=aplicacao-not-found-error.js.map