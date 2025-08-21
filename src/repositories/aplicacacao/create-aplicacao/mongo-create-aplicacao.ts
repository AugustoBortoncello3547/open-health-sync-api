import type {
  ICreateAplicaoRepository,
  TCreateAplicacao,
} from "../../../controllers/aplicacao/create-aplicacao/types.js";
import { AplicacaoModel } from "../../../models/aplicacao-model.js";

export class MongoCreateAplicacaoRepository implements ICreateAplicaoRepository {
  async createAplicacao(aplicacacao: TCreateAplicacao): Promise<string> {
    const aplicacao = new AplicacaoModel(aplicacacao);
    const saved = await aplicacao.save();
    return saved._id.toString();
  }
}
