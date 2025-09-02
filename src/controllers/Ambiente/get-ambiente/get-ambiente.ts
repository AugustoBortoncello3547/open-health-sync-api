import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatusCodeEnum } from "../../../enums/http-status-code-enum.js";
import { AmbienteNotFoundError } from "../../../errors/ambiente-not-found-error.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { GetAmbienteParams, IGetAmbienteController, IGetAmbienteRepository } from "./types.js";

export class GetAmbienteController implements IGetAmbienteController {
  constructor(private readonly getAmbienteRepository: IGetAmbienteRepository) {}

  async handle(
    request: FastifyRequest<{ Params: GetAmbienteParams; Headers: { authorization?: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    const authHeader = request.headers.authorization;
    const { idAmbiente } = request.params;

    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);

    const ambiente = await this.getAmbienteRepository.getAmbiente(idAmbiente, idAplicacao);
    if (!ambiente) {
      throw new AmbienteNotFoundError();
    }

    reply.status(HttpStatusCodeEnum.OK).send({
      ...ambiente,
      atualizadoEm: ambiente.atualizadoEm.toISOString(),
      criadoEm: ambiente.criadoEm.toISOString(),
    });
  }
}
