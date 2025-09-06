import mongoose from "mongoose";
import type { TAmbiente, TAmbienteMongo } from "../../../controllers/ambiente_bkp/types";
import { AmbienteModel } from "../../../models/ambiente-model";
import type { IGetAmbienteRepository } from "../../../controllers/ambiente_bkp/get-ambiente/types";

export class MongoGetAmbienteRepository implements IGetAmbienteRepository {
  async getAmbiente(id: string, idAplicacao: string): Promise<TAmbiente | null> {
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

    const ambienteObj = ambienteDoc.toObject<TAmbienteMongo>();
    const { _id, __v, ...rest } = ambienteObj;

    return {
      id: _id.toString(),
      ...rest,
    };
  }

  async getAmbienteOnlyByIdExterno(idExterno: string, idAplicacao: string): Promise<TAmbiente | null> {
    const ambienteDoc = await AmbienteModel.findOne({ idExterno, idAplicacao }).exec();
    if (!ambienteDoc) {
      return null;
    }

    const ambienteObj = ambienteDoc.toObject<TAmbienteMongo>();
    const { _id, __v, ...rest } = ambienteObj;

    return {
      id: _id.toString(),
      ...rest,
    };
  }
}
