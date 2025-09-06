import { randomBytes } from "crypto";
import { StatusAmbienteEnum } from "../../../enums/ambiente/status-ambiente-enum";
import { AmbienteWithIdExternoAlreadyInUseError } from "../../../errors/ambiente-with-idexterno-already-in-use-error";
import { MongoCreateAmbienteRepository } from "../../../repositories/ambiente/create-ambiente/mongo-create-ambiente";
import { MongoGetAmbienteRepository } from "../../../repositories/ambiente/get-ambiente/mongo-get-ambiente";
import { JwtTokenController } from "../../token/jwt-token-controller";
export class CreateAmbienteController {
    createAmbienteRepository;
    getAmbienteRepository;
    constructor(createAmbienteRepository = new MongoCreateAmbienteRepository(), getAmbienteRepository = new MongoGetAmbienteRepository()) {
        this.createAmbienteRepository = createAmbienteRepository;
        this.getAmbienteRepository = getAmbienteRepository;
    }
    async handle(createAmbienteRequest, authHeader) {
        const jwtTokenController = new JwtTokenController();
        const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);
        const ambienteWithSameIdExterno = await this.getAmbienteRepository.getAmbienteOnlyByIdExterno(createAmbienteRequest.idExterno, idAplicacao);
        if (ambienteWithSameIdExterno) {
            throw new AmbienteWithIdExternoAlreadyInUseError();
        }
        const generatedApiKey = await this.generateAmbienteApiKey();
        const idAmbiente = await this.createAmbienteRepository.createAmbiente({
            status: StatusAmbienteEnum.ATIVO,
            apiKey: generatedApiKey,
            idAplicacao: idAplicacao,
            ...createAmbienteRequest,
        });
        return idAmbiente;
    }
    async generateAmbienteApiKey() {
        return "amb_" + randomBytes(24).toString("hex");
    }
}
//# sourceMappingURL=create-ambiente.js.map