import type {
  ICreateAplicacaoRepository,
  TCreateAplicacao,
} from "../../../controllers/aplicacao/create-aplicacao/types";
import { AplicacaoModel } from "../../../models/aplicacao-model";

export class MongoCreateAplicacaoRepository implements ICreateAplicacaoRepository {
  async createAplicacao(aplicacacao: TCreateAplicacao): Promise<string> {
    const aplicacao = new AplicacaoModel(aplicacacao);
    const saved = await aplicacao.save();
    return saved._id.toString();
  }
}
