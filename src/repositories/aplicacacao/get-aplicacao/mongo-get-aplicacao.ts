import mongoose from "mongoose";
import type { IGetAplicaoRepository, TAplicacaoMongo } from "../../../controllers/aplicacao/get-aplicacao/types.js";
import { AplicacaoModel } from "../../../models/aplicacao-model.js";
import type { TAplicacao } from "../../../controllers/aplicacao/types.js";

export class MongoGetAplicacaoRepository implements IGetAplicaoRepository {
  async getAplicacao(id: string): Promise<TAplicacao | null> {
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

  async getAplicaoByEmail(email: string): Promise<TAplicacao | null> {
    const aplicacao = await AplicacaoModel.findOne({ email }).lean<TAplicacaoMongo>().exec();

    if (!aplicacao) {
      return null;
    }

    const { _id, ...rest } = aplicacao;
    return {
      id: _id.toString(),
      ...rest,
    };
  }

  async countAplicacoesByEmail(email: string): Promise<number> {
    return AplicacaoModel.countDocuments({ email }).exec();
  }
}
