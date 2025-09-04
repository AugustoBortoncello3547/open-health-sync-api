import { AplicacaoNotFoundError } from "../../../errors/aplicacao-not-found-error.js";
import { MongoGetAplicacaoRepository } from "../../../repositories/aplicacacao/get-aplicacao/mongo-get-aplicacao.js";
import type { IGetAplicacaoController, IGetAplicacaoRepository, TAplicacaoResponse } from "./types.js";

export class GetAplicacaoController implements IGetAplicacaoController {
  constructor(private readonly getAplicacaoRepository: IGetAplicacaoRepository = new MongoGetAplicacaoRepository()) {}

  async handle(idAplicacao: string): Promise<TAplicacaoResponse> {
    const aplicacao = await this.getAplicacaoRepository.getAplicacao(idAplicacao);
    if (!aplicacao) {
      throw new AplicacaoNotFoundError();
    }

    return {
      ...aplicacao,
      criadoEm: aplicacao.criadoEm.toISOString(),
      atualizadoEm: aplicacao.atualizadoEm.toISOString(),
    };
  }
}
