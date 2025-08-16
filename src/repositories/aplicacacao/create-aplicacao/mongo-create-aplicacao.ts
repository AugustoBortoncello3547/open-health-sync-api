import type {
  CreateAplicacaoParams,
  ICreateAplicaoRepository,
} from "../../../controllers/aplicacao/create-aplicacao/types.js";
import { AplicacaoModel } from "../../../models/aplicacao-model.js";

export class MongoCreateAplicacaoRepository implements ICreateAplicaoRepository {
  async createAplicacao(params: CreateAplicacaoParams): Promise<string> {
    try {
      const aplicacao = new AplicacaoModel(params);
      const saved = await aplicacao.save();
      return saved._id.toString();
    } catch (error) {
      console.error("Erro ao criar aplicação:", error);
      throw error;
    }
  }
}
