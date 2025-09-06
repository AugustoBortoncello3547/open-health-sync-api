import { AmbienteNotFoundError } from "../../../errors/ambiente-not-found-error";
import { MongoDeleteAmbienteRepository } from "../../../repositories/ambiente/delete-ambiente/mongo-delete-ambiente";
import { MongoGetAmbienteRepository } from "../../../repositories/ambiente/get-ambiente/mongo-get-ambiente";
import { JwtTokenController } from "../../token/jwt-token-controller";
export class DeleteAmbienteController {
    getAmbienteRepository;
    deleteAmbienteRepository;
    constructor(getAmbienteRepository = new MongoGetAmbienteRepository(), deleteAmbienteRepository = new MongoDeleteAmbienteRepository()) {
        this.getAmbienteRepository = getAmbienteRepository;
        this.deleteAmbienteRepository = deleteAmbienteRepository;
    }
    async handle(idAmbiente, authHeader) {
        const jwtTokenController = new JwtTokenController();
        const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);
        const ambiente = await this.getAmbienteRepository.getAmbiente(idAmbiente, idAplicacao);
        if (!ambiente) {
            throw new AmbienteNotFoundError();
        }
        // TODO: validar se não tem pacientes no ambiente
        await this.deleteAmbienteRepository.deleteAmbiente(ambiente.id, idAplicacao);
    }
}
//# sourceMappingURL=delete-ambiente.js.map