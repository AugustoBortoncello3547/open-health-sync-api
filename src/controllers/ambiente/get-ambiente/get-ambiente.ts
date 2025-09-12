import { StatusAmbienteEnum } from "../../../enums/ambiente/status-ambiente-enum.js";
import { AmbienteNotFoundError } from "../../../errors/ambiente-not-found-error.js";
import { AmbienteUnavailableError } from "../../../errors/ambiente-unavailable-error.js";
import { MongoGetAmbienteRepository } from "../../../repositories/ambiente/get-ambiente/mongo-get-ambiente.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { TAmbienteResponse } from "../types.js";
import type { IGetAmbienteController, IGetAmbienteRepository } from "./types.js";

export class GetAmbienteController implements IGetAmbienteController {
  constructor(private readonly getAmbienteRepository: IGetAmbienteRepository = new MongoGetAmbienteRepository()) {}

  async handle(idAmbiente: string, authHeader?: string): Promise<TAmbienteResponse> {
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

  async validateAmbienteIsAvailable(idAmbiente: string, idAplicacao: string): Promise<void> {
    const ambiente = await this.getAmbienteRepository.getAmbiente(idAmbiente, idAplicacao);
    if (!ambiente) {
      throw new AmbienteNotFoundError();
    }

    if (ambiente.status !== StatusAmbienteEnum.ATIVO) {
      throw new AmbienteUnavailableError();
    }
  }
}
