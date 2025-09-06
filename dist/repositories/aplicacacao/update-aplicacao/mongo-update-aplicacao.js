import { AplicacaoModel } from "../../../models/aplicacao-model";
export class MongoUpdateAplicacaoRepository {
    async updateAplicacao(idAplicacao, updateAplicacao) {
        const aplicacao = await AplicacaoModel.findById(idAplicacao);
        if (!aplicacao) {
            throw new Error("Aplicação não encontrada");
        }
        aplicacao.set({
            ...updateAplicacao,
        });
        const updated = await aplicacao.save();
        return updated._id.toString();
    }
}
//# sourceMappingURL=mongo-update-aplicacao.js.map