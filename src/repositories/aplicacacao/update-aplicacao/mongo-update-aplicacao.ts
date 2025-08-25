import type {
  IUpdateAplicacaoRepository,
  TUpdateAplicacao,
} from "../../../controllers/aplicacao/update-aplicacao/types.js";
import { AplicacaoModel } from "../../../models/aplicacao-model.js";

export class MongoUpdateAplicacaoRepository implements IUpdateAplicacaoRepository {
  async updateAplicacao(idAplicacao: string, updateAplicacao: TUpdateAplicacao): Promise<string> {
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
