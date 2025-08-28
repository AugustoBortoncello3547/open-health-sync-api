import mongoose from "mongoose";
import type { TAmbiente, TAmbienteMongo } from "../../../controllers/ambiente/types.js";
import { AmbienteModel } from "../../../models/ambiente-model.js";
import type { IGetAmbienteRepository } from "../../../controllers/ambiente/get-ambiente/types.js";

export class MongoGetAmbienteRepository implements IGetAmbienteRepository {
  async getAmbiente(id: string): Promise<TAmbiente | null> {
    let ambienteDoc = null;

    // Primeiro tentamos buscar pelo id da collection do mongo
    if (mongoose.isValidObjectId(id)) {
      ambienteDoc = await AmbienteModel.findById(id).exec();
    }

    // Se não achou nada, tenta buscar pelo idExterno
    if (!ambienteDoc) {
      return await this.getAmbienteOnlyByIdExterno(id);
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

  async getAmbienteOnlyByIdExterno(idExterno: string): Promise<TAmbiente | null> {
    const ambienteDoc = await AmbienteModel.findOne({ idExterno }).exec();
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
