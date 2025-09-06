import { AmbienteNotFoundError } from "../../../errors/ambiente-not-found-error";
import { MongoGetAmbienteRepository } from "../../../repositories/ambiente/get-ambiente/mongo-get-ambiente";
import { JwtTokenController } from "../../token/jwt-token-controller";
export class GetAmbienteController {
    getAmbienteRepository;
    constructor(getAmbienteRepository = new MongoGetAmbienteRepository()) {
        this.getAmbienteRepository = getAmbienteRepository;
    }
    async handle(idAmbiente, authHeader) {
        const jwtTokenController = new JwtTokenController();
        const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);
        const ambiente = await this.getAmbienteRepository.getAmbiente(idAmbiente, idAplicacao);
        if (!ambiente) {
            throw new AmbienteNotFoundError();
        }
        return {
            ...ambiente,
            atualizadoEm: ambiente.atualizadoEm.toISOString(),
            criadoEm: ambiente.criadoEm.toISOString(),
        };
    }
}
//# sourceMappingURL=get-ambiente.js.map