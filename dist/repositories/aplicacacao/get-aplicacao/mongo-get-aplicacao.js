import mongoose from "mongoose";
import { AplicacaoModel } from "../../../models/aplicacao-model";
export class MongoGetAplicacaoRepository {
    async getAplicacao(id) {
        if (!mongoose.isValidObjectId(id)) {
            return null;
        }
        let aplicacaoDoc = await AplicacaoModel.findById(id).exec();
        if (!aplicacaoDoc) {
            return null;
        }
        const aplicacaoObj = aplicacaoDoc.toObject();
        const { _id, __v, ...rest } = aplicacaoObj;
        return {
            id: _id.toString(),
            ...rest,
        };
    }
    async getAplicacaoByEmail(email) {
        const aplicacao = await AplicacaoModel.findOne({ email }).lean().exec();
        if (!aplicacao) {
            return null;
        }
        const { _id, ...rest } = aplicacao;
        return {
            id: _id.toString(),
            ...rest,
        };
    }
    async countAplicacoesByEmail(email) {
        return AplicacaoModel.countDocuments({ email }).exec();
    }
}
//# sourceMappingURL=mongo-get-aplicacao.js.map