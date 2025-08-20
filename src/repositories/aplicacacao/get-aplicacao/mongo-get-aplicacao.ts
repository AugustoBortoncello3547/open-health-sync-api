import mongoose from "mongoose";
import type {
  Aplicacao,
  IGetAplicaoRepository,
  TAplicacaoMongo,
} from "../../../controllers/aplicacao/get-aplicacap/types.js";
import { AplicacaoModel } from "../../../models/aplicacao-model.js";

export class MongoGetAplicacaoRepository implements IGetAplicaoRepository {
  async getAplicacao(id: string): Promise<Aplicacao | null> {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    let aplicacaoDoc = await AplicacaoModel.findById(id).exec();
    if (!aplicacaoDoc) {
      return null;
    }

    const aplicacaoObj = aplicacaoDoc.toObject<TAplicacaoMongo>();
    const { _id, __v, ...rest } = aplicacaoObj;

    return {
      id: _id.toString(),
      ...rest,
    };
  }

  async getAplicaoByUsuario(usuario: string): Promise<Aplicacao | null> {
    const aplicacao = await AplicacaoModel.findOne({ usuario }).lean<TAplicacaoMongo>().exec();

    if (!aplicacao) {
      return null;
    }

    const { _id, ...rest } = aplicacao;
    return {
      id: _id.toString(),
      ...rest,
    };
  }
}
