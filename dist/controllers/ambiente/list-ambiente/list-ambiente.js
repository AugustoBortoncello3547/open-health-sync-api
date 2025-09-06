import { MongoListAmbienteRepository } from "../../../repositories/ambiente/list-ambiente/mongo-list-ambiente";
import { JwtTokenController } from "../../token/jwt-token-controller";
export class ListAmbienteController {
    listAmbienteRepository;
    constructor(listAmbienteRepository = new MongoListAmbienteRepository()) {
        this.listAmbienteRepository = listAmbienteRepository;
    }
    async handle(listAmbienteFilters, authHeader) {
        const jwtTokenController = new JwtTokenController();
        const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);
        const ambientes = await this.listAmbienteRepository.listAmbiente(listAmbienteFilters, idAplicacao);
        const normalizedAmbientes = ambientes.map((ambiente) => {
            return {
                ...ambiente,
                atualizadoEm: ambiente.atualizadoEm.toISOString(),
                criadoEm: ambiente.criadoEm.toISOString(),
            };
        });
        return {
            registros: normalizedAmbientes,
            total: ambientes.length,
            limit: listAmbienteFilters.limit,
            offset: listAmbienteFilters.offset,
        };
    }
}
//# sourceMappingURL=list-ambiente.js.map