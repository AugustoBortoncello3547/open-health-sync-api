import mongoose from "mongoose";
import type {
  Aplicacao,
  IGetAplicaoRepository,
  TAplicacaoMongo,
} from "../../../controllers/aplicacao/get-aplicacap/types.js";
import { AplicacaoNaoEncontradaError } from "../../../errors/aplicacao-nao-encontrada-error.js";
import { AplicacaoModel } from "../../../models/aplicacao-model.js";
import { InvalidIdError } from "../../../errors/invalid-id-error.js";

export class MongoGetAplicacaoRepository implements IGetAplicaoRepository {
  async getAplicacao(id: string): Promise<Aplicacao> {
    if (!mongoose.isValidObjectId(id)) {
      throw new InvalidIdError();
    }

    const aplicacao = await AplicacaoModel.findById(id).lean<TAplicacaoMongo>().exec();
    if (!aplicacao) {
      throw new AplicacaoNaoEncontradaError();
    }

    const { _id, ...rest } = aplicacao;
    return {
      id: _id.toString(),
      ...rest,
    };
  }
}
