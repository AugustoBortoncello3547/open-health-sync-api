import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetAplicacaoParams, IGetAplicaoController, IGetAplicaoRepository } from "./types.js";
import { HttpStatusCode } from "../../../enums/http-status-code-enum.js";

export class GetAplicacaoController implements IGetAplicaoController {
  constructor(private readonly getAplicaoRepository: IGetAplicaoRepository) {}

  async handle(request: FastifyRequest<{ Params: GetAplicacaoParams }>, reply: FastifyReply): Promise<void> {
    const { idAplicacao } = request.params;

    const aplicacao = await this.getAplicaoRepository.getAplicacao(idAplicacao);
    reply.status(HttpStatusCode.OK).send({
      ...aplicacao,
      criadoEm: aplicacao.criadoEm.toISOString(),
      atualizadoEm: aplicacao.atualizadoEm.toISOString(),
    });
  }
}
