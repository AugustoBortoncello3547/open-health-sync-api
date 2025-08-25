import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatusCode } from "../../../enums/http-status-code-enum.js";
import { StatusAmbienteEnum } from "../../../enums/Ambiente/status-ambiente-enum.js";
import type { ICreateAmbienteController, ICreateAmbienteRepository, TCreateAmbienteParams } from "./types.js";
import { randomBytes } from "crypto";

export class CreateAmbienteController implements ICreateAmbienteController {
  constructor(private readonly createAmbienteRepository: ICreateAmbienteRepository) {}

  async handle(request: FastifyRequest<{ Body: TCreateAmbienteParams }>, reply: FastifyReply): Promise<void> {
    const ambiente = request.body;

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
