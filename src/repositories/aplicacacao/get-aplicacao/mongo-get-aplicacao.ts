import type {
  Aplicacao,
  IGetAplicaoRepository,
  TAplicacaoMongo,
} from "../../../controllers/aplicacao/get-aplicacap/types.js";
import { AplicacaoNaoEncontradaError } from "../../../Errors/AplicacaoNaoEncontradaError.js";
import { AplicacaoModel } from "../../../models/aplicacao-model.js";

export class MongoGetAplicacaoRepository implements IGetAplicaoRepository {
  async getAplicacao(id: string): Promise<Aplicacao> {
    try {
      const aplicacao = await AplicacaoModel.findById(id).lean<TAplicacaoMongo>().exec();
      if (!aplicacao) {
        throw new AplicacaoNaoEncontradaError();
      }

      const { _id, ...rest } = aplicacao;
      return {
        id: _id.toString(),
        ...rest,
      };
    } catch (error) {
      console.error("Erro ao obter a aplicação:", error);
      throw error;
    }
  }
}
