import { randomBytes } from "crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusAmbienteEnum } from "../../../enums/ambiente/status-ambiente-enum.js";
import { HttpStatusCodeEnum } from "../../../enums/http-status-code-enum.js";
import { AmbienteWithIdExternoAlreadyInUseError } from "../../../errors/ambiente-with-idexterno-already-in-use-error.js";
import type { IGetAmbienteRepository } from "../get-ambiente/types.js";
import type { ICreateAmbienteController, ICreateAmbienteRepository, TCreateAmbienteParams } from "./types.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";

export class CreateAmbienteController implements ICreateAmbienteController {
  constructor(
    private readonly createAmbienteRepository: ICreateAmbienteRepository,
    private readonly getAmbienteRepository: IGetAmbienteRepository,
  ) {}

  async handle(
    request: FastifyRequest<{ Body: TCreateAmbienteParams; Headers: { authorization?: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    const authHeader = request.headers.authorization;
    const ambiente = request.body;

    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);
    const ambienteWithSameIdExterno = await this.getAmbienteRepository.getAmbienteOnlyByIdExterno(
      ambiente.idExterno,
      idAplicacao,
    );
    if (ambienteWithSameIdExterno) {
      throw new AmbienteWithIdExternoAlreadyInUseError();
    }

    const generatedApiKey = await this.generateAmbienteApiKey();
    const id = await this.createAmbienteRepository.createAmbiente({
      status: StatusAmbienteEnum.ATIVO,
      apiKey: generatedApiKey,
      idAplicacao: idAplicacao,
      ...ambiente,
    });
    reply.status(HttpStatusCodeEnum.CREATED).send({ id });
  }

  async generateAmbienteApiKey(): Promise<string> {
    return "amb_" + randomBytes(24).toString("hex");
  }
}
