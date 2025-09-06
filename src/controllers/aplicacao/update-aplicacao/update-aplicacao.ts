import { AplicacaoNotFoundError } from "../../../errors/aplicacao-not-found-error";
import { EmailAlreadyInUseError } from "../../../errors/email-already-in-use-error";
import { MongoGetAplicacaoRepository } from "../../../repositories/aplicacacao/get-aplicacao/mongo-get-aplicacao";
import { MongoUpdateAplicacaoRepository } from "../../../repositories/aplicacacao/update-aplicacao/mongo-update-aplicacao";
import type { IGetAplicacaoRepository } from "../get-aplicacao/types";
import type { IUpdateAplicacaoController, IUpdateAplicacaoRepository, TUpdateAplicacaoRequest } from "./types";

export class UpdateAplicacaoController implements IUpdateAplicacaoController {
  constructor(
    private readonly getAplicacaoRepository: IGetAplicacaoRepository = new MongoGetAplicacaoRepository(),
    private readonly updateAplicacaoRepository: IUpdateAplicacaoRepository = new MongoUpdateAplicacaoRepository(),
  ) {}

  async handle(idAplicacao: string, updateAplicacacaoRequest: TUpdateAplicacaoRequest): Promise<string> {
    const aplicacao = await this.getAplicacaoRepository.getAplicacao(idAplicacao);
    if (!aplicacao) {
      throw new AplicacaoNotFoundError();
    }

    const emailUpdateRequest = updateAplicacacaoRequest.email;
    if (emailUpdateRequest) {
      const hasAplicacaoWithSameEmail =
        (await this.getAplicacaoRepository.countAplicacoesByEmail(emailUpdateRequest)) > 0;
      if (hasAplicacaoWithSameEmail) {
        throw new EmailAlreadyInUseError();
      }

      aplicacao.email = emailUpdateRequest;
    }

    if (updateAplicacacaoRequest.status) {
      aplicacao.status = updateAplicacacaoRequest.status;
    }

    if (updateAplicacacaoRequest.dados) {
      aplicacao.dados = aplicacao.dados || {};
      this.mergeDeep(aplicacao.dados, updateAplicacacaoRequest.dados);
    }

    const idUpdatedAplicacao = await this.updateAplicacaoRepository.updateAplicacao(aplicacao.id, aplicacao);
    return idUpdatedAplicacao;
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
