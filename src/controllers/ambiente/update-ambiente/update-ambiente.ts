import { AmbienteNotFoundError } from "../../../errors/ambiente-not-found-error.js";
import { AmbienteWithIdExternoAlreadyInUseError } from "../../../errors/ambiente-with-idexterno-already-in-use-error.js";
import { MongoGetAmbienteRepository } from "../../../repositories/ambiente/get-ambiente/mongo-get-ambiente.js";
import { MongoUpdateAmbienteRepository } from "../../../repositories/ambiente/update-ambiente/mongo-update-ambiente.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IJwtTokenController } from "../../token/types.js";
import type { IGetAmbienteRepository } from "../get-ambiente/types.js";
import type { IUpdateAmbienteController, IUpdateAmbienteRepository, TUpdateAmbienteRequest } from "./types.js";

export class UpdateAmbienteController implements IUpdateAmbienteController {
  constructor(
    private readonly getAmbienteRepository: IGetAmbienteRepository = new MongoGetAmbienteRepository(),
    private readonly updateAmbienteRepository: IUpdateAmbienteRepository = new MongoUpdateAmbienteRepository(),
    private readonly jwtTokenController: IJwtTokenController = new JwtTokenController(),
  ) {}

  async handle(
    idAmbiente: string,
    updateAplicacacaoRequest: TUpdateAmbienteRequest,
    authHeader?: string,
  ): Promise<string> {
    const { idAplicacao } = await this.jwtTokenController.getTokenData(authHeader);

    const ambiente = await this.getAmbienteRepository.getAmbiente(idAmbiente, idAplicacao);
    if (!ambiente) {
      throw new AmbienteNotFoundError();
    }

    const { idExterno, nome, status, urlWebhook, tokenWebhook } = updateAplicacacaoRequest;
    if (idExterno) {
      const ambienteWithSameIdExterno = await this.getAmbienteRepository.getAmbienteOnlyByIdExterno(
        idExterno,
        idAplicacao,
      );
      if (ambienteWithSameIdExterno) {
        throw new AmbienteWithIdExternoAlreadyInUseError();
      }

      ambiente.idExterno = idExterno;
    }

    if (nome) {
      ambiente.nome = nome;
    }

    if (status) {
      ambiente.status = status;
    }

    if (urlWebhook) {
      ambiente.urlWebhook = urlWebhook;
    }

    if (tokenWebhook) {
      ambiente.tokenWebhook = tokenWebhook;
    }

    const idUpdatedAmbiente = await this.updateAmbienteRepository.updateAmbiente(ambiente.id, ambiente);
    return idUpdatedAmbiente;
  }
}
