import { AmbienteNotFoundError } from "../../../errors/ambiente-not-found-error";
import { MongoGetAmbienteRepository } from "../../../repositories/ambiente/get-ambiente/mongo-get-ambiente";
import { JwtTokenController } from "../../token/jwt-token-controller";
import type { TAmbienteResponse } from "../types";
import type { IGetAmbienteController, IGetAmbienteRepository } from "./types";

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
}
