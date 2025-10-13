import { randomBytes } from "crypto";
import { StatusAmbienteEnum } from "../../../enums/ambiente/status-ambiente-enum.js";
import { AmbienteWithIdExternoAlreadyInUseError } from "../../../errors/ambiente-with-idexterno-already-in-use-error.js";
import { MongoCreateAmbienteRepository } from "../../../repositories/ambiente/create-ambiente/mongo-create-ambiente.js";
import { MongoGetAmbienteRepository } from "../../../repositories/ambiente/get-ambiente/mongo-get-ambiente.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IJwtTokenController } from "../../token/types.js";
import type { IGetAmbienteRepository } from "../get-ambiente/types.js";
import type { ICreateAmbienteController, ICreateAmbienteRepository, TCreateAmbienteRequest } from "./types.js";

export class CreateAmbienteController implements ICreateAmbienteController {
  constructor(
    private readonly createAmbienteRepository: ICreateAmbienteRepository = new MongoCreateAmbienteRepository(),
    private readonly getAmbienteRepository: IGetAmbienteRepository = new MongoGetAmbienteRepository(),
    private readonly jwtTokenController: IJwtTokenController = new JwtTokenController(),
  ) {}

  async handle(createAmbienteRequest: TCreateAmbienteRequest, authHeader?: string): Promise<string> {
    const { idAplicacao } = await this.jwtTokenController.getTokenData(authHeader);

    const ambienteWithSameIdExterno = await this.getAmbienteRepository.getAmbienteOnlyByIdExterno(
      createAmbienteRequest.idExterno,
      idAplicacao,
    );
    if (ambienteWithSameIdExterno) {
      throw new AmbienteWithIdExternoAlreadyInUseError();
    }

    const idAmbiente = await this.createAmbienteRepository.createAmbiente({
      status: StatusAmbienteEnum.ATIVO,
      idAplicacao: idAplicacao,
      ...createAmbienteRequest,
    });
    return idAmbiente;
  }
}
