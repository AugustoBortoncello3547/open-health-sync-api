import { randomBytes } from "crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusAmbienteEnum } from "../../../enums/Ambiente/status-ambiente-enum.js";
import { HttpStatusCode } from "../../../enums/http-status-code-enum.js";
import { AmbienteWithIdExternoAlreadyInUseError } from "../../../errors/ambiente-with-idexterno-already-in-use-error.js";
import type { IGetAmbienteRepository } from "../get-ambiente/types.js";
import type { ICreateAmbienteController, ICreateAmbienteRepository, TCreateAmbienteParams } from "./types.js";

export class CreateAmbienteController implements ICreateAmbienteController {
  constructor(
    private readonly createAmbienteRepository: ICreateAmbienteRepository,
    private readonly getAmbienteRepository: IGetAmbienteRepository,
  ) {}

  async handle(request: FastifyRequest<{ Body: TCreateAmbienteParams }>, reply: FastifyReply): Promise<void> {
    const ambiente = request.body;

    const ambienteWithSameIdExterno = await this.getAmbienteRepository.getAmbienteOnlyByIdExterno(ambiente.idExterno);
    if (ambienteWithSameIdExterno) {
      throw new AmbienteWithIdExternoAlreadyInUseError();
    }

    // TODO: Vamos ter o idAplicacao via JWT
    const idAplicacao = "Teste123Temp";
    const generatedApiKey = await this.generateAmbienteApiKey();
    const id = await this.createAmbienteRepository.createAmbiente({
      status: StatusAmbienteEnum.ATIVO,
      apiKey: generatedApiKey,
      idAplicacao: idAplicacao,
      ...ambiente,
    });
    reply.status(HttpStatusCode.CREATED).send({ id });
  }

  async generateAmbienteApiKey(): Promise<string> {
    return "amb_" + randomBytes(24).toString("hex");
  }
}
