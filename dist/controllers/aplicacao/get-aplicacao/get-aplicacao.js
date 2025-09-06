import { AplicacaoNotFoundError } from "../../../errors/aplicacao-not-found-error";
import { MongoGetAplicacaoRepository } from "../../../repositories/aplicacacao/get-aplicacao/mongo-get-aplicacao";
export class GetAplicacaoController {
    getAplicacaoRepository;
    constructor(getAplicacaoRepository = new MongoGetAplicacaoRepository()) {
        this.getAplicacaoRepository = getAplicacaoRepository;
    }
    async handle(idAplicacao) {
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
//# sourceMappingURL=get-aplicacao.js.map