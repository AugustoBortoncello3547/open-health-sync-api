import { randomBytes } from "crypto";
import { StatusAmbienteEnum } from "../../../enums/ambiente/status-ambiente-enum";
import { AmbienteWithIdExternoAlreadyInUseError } from "../../../errors/ambiente-with-idexterno-already-in-use-error";
import { MongoCreateAmbienteRepository } from "../../../repositories/ambiente/create-ambiente/mongo-create-ambiente";
import { MongoGetAmbienteRepository } from "../../../repositories/ambiente/get-ambiente/mongo-get-ambiente";
import { JwtTokenController } from "../../token/jwt-token-controller";
import type { IGetAmbienteRepository } from "../get-ambiente/types";
import type { ICreateAmbienteController, ICreateAmbienteRepository, TCreateAmbienteRequest } from "./types";

export class CreateAmbienteController implements ICreateAmbienteController {
  constructor(
    private readonly createAmbienteRepository: ICreateAmbienteRepository = new MongoCreateAmbienteRepository(),
    private readonly getAmbienteRepository: IGetAmbienteRepository = new MongoGetAmbienteRepository(),
  ) {}

  async handle(createAmbienteRequest: TCreateAmbienteRequest, authHeader?: string): Promise<string> {
    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);
    const ambienteWithSameIdExterno = await this.getAmbienteRepository.getAmbienteOnlyByIdExterno(
      createAmbienteRequest.idExterno,
      idAplicacao,
    );
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

  async generateAmbienteApiKey(): Promise<string> {
    return "amb_" + randomBytes(24).toString("hex");
  }
}
