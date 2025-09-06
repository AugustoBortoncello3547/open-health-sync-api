import type {
  IUpdateAplicacaoRepository,
  TUpdateAplicacaoRequest,
} from "../../../controllers/aplicacao/update-aplicacao/types";
import { AplicacaoModel } from "../../../models/aplicacao-model";

export class MongoUpdateAplicacaoRepository implements IUpdateAplicacaoRepository {
  async updateAplicacao(idAplicacao: string, updateAplicacao: TUpdateAplicacaoRequest): Promise<string> {
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
