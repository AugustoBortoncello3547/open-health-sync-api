import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatusCode } from "../../../enums/http-status-code-enum.js";
import { AplicacaoNotFoundError } from "../../../errors/aplicacao-not-found-error.js";
import type { GetAplicacaoParams, IGetAplicacaoController, IGetAplicacaoRepository } from "./types.js";

export class GetAplicacaoController implements IGetAplicacaoController {
  constructor(private readonly getAplicacaoRepository: IGetAplicacaoRepository) {}

  async handle(request: FastifyRequest<{ Params: GetAplicacaoParams }>, reply: FastifyReply): Promise<void> {
    const { idAplicacao } = request.params;

    const aplicacao = await this.getAplicacaoRepository.getAplicacao(idAplicacao);
    if (!aplicacao) {
      throw new AplicacaoNotFoundError();
    }

    reply.status(HttpStatusCode.OK).send({
      ...aplicacao,
      criadoEm: aplicacao.criadoEm.toISOString(),
      atualizadoEm: aplicacao.atualizadoEm.toISOString(),
    });
  }
}
