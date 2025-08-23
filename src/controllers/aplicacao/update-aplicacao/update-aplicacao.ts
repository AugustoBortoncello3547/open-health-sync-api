import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatusCode } from "../../../enums/http-status-code-enum.js";
import { AplicacaoNotFoundError } from "../../../errors/aplicacao-not-found-error.js";
import type { IGetAplicaoRepository } from "../get-aplicacao/types.js";
import type {
  IUpdateAplicaoController,
  IUpdateAplicaoRepository,
  TUpdateAplicacao,
  TUpdateAplicacaoParams,
} from "./types.js";
import { EmailAlreadyInUseError } from "../../../errors/email-already-in-use-error.js";

export class UpdateAplicacaoController implements IUpdateAplicaoController {
  constructor(
    private readonly getAplicaoRepository: IGetAplicaoRepository,
    private readonly updateAplicaoRepository: IUpdateAplicaoRepository,
  ) {}

  async handle(
    request: FastifyRequest<{ Body: TUpdateAplicacao; Params: TUpdateAplicacaoParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const aplicacacaoRequest = request.body;
    const { idAplicacao } = request.params;

    const aplicacao = await this.getAplicaoRepository.getAplicacao(idAplicacao);
    if (!aplicacao) {
      throw new AplicacaoNotFoundError();
    }

    const emailUpdateRequest = aplicacacaoRequest.email;
    if (emailUpdateRequest) {
      const hasAplicacaoWithSameEmail =
        (await this.getAplicaoRepository.countAplicacoesByEmail(emailUpdateRequest)) > 0;
      if (hasAplicacaoWithSameEmail) {
        throw new EmailAlreadyInUseError();
      }

      aplicacao.email = emailUpdateRequest;
    }

    if (aplicacacaoRequest.status) {
      aplicacao.status = aplicacacaoRequest.status;
    }

    if (aplicacacaoRequest.dados) {
      aplicacao.dados = aplicacao.dados || {};
      this.mergeDeep(aplicacao.dados, aplicacacaoRequest.dados);
    }

    const id = await this.updateAplicaoRepository.updateAplicacao(aplicacao.id, aplicacao);
    reply.status(HttpStatusCode.OK).send({ id });
  }

  mergeDeep(target: any, source: any) {
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        target[key] = target[key] || {};
        this.mergeDeep(target[key], source[key]);
      } else if (source[key] !== undefined) {
        target[key] = source[key];
      }
    }
  }
}
