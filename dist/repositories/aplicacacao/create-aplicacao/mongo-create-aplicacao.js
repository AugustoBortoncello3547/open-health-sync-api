import { AplicacaoModel } from "../../../models/aplicacao-model";
export class MongoCreateAplicacaoRepository {
    async createAplicacao(aplicacacao) {
        const aplicacao = new AplicacaoModel(aplicacacao);
        const saved = await aplicacao.save();
        return saved._id.toString();
    }
}
//# sourceMappingURL=mongo-create-aplicacao.js.map