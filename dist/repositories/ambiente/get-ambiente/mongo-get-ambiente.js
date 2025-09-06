import mongoose from "mongoose";
import { AmbienteModel } from "../../../models/ambiente-model";
export class MongoGetAmbienteRepository {
    async getAmbiente(id, idAplicacao) {
        let ambienteDoc = null;
        // Primeiro tentamos buscar pelo id da collection do mongo
        if (mongoose.isValidObjectId(id)) {
            ambienteDoc = await AmbienteModel.findOne({
                _id: id,
                idAplicacao: idAplicacao,
            }).exec();
        }
        // Se não achou nada, tenta buscar pelo idExterno
        if (!ambienteDoc) {
            return await this.getAmbienteOnlyByIdExterno(id, idAplicacao);
        }
        if (!ambienteDoc) {
            return null;
        }
        const ambienteObj = ambienteDoc.toObject();
        const { _id, __v, ...rest } = ambienteObj;
        return {
            id: _id.toString(),
            ...rest,
        };
    }
    async getAmbienteOnlyByIdExterno(idExterno, idAplicacao) {
        const ambienteDoc = await AmbienteModel.findOne({ idExterno, idAplicacao }).exec();
        if (!ambienteDoc) {
            return null;
        }
        const ambienteObj = ambienteDoc.toObject();
        const { _id, __v, ...rest } = ambienteObj;
        return {
            id: _id.toString(),
            ...rest,
        };
    }
}
//# sourceMappingURL=mongo-get-ambiente.js.map