import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatusCode } from "../../../enums/http-status-code-enum.js";
import { AmbienteNotFoundError } from "../../../errors/ambiente-not-found-error.js";
import type { GetAmbienteParams, IGetAmbienteController, IGetAmbienteRepository } from "./types.js";

export class GetAmbienteController implements IGetAmbienteController {
  constructor(private readonly getAmbienteRepository: IGetAmbienteRepository) {}

  async handle(request: FastifyRequest<{ Params: GetAmbienteParams }>, reply: FastifyReply): Promise<void> {
    const { idAmbiente } = request.params;

    const ambiente = await this.getAmbienteRepository.getAmbiente(idAmbiente);
    if (!ambiente) {
      throw new AmbienteNotFoundError();
    }

    reply.status(HttpStatusCode.OK).send({
      ...ambiente,
      criadoEm: ambiente.criadoEm.toISOString(),
      atualizadoEm: ambiente.atualizadoEm.toISOString(),
    });
  }
}
