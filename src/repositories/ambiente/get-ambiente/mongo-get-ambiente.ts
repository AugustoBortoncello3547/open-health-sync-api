import mongoose from "mongoose";
import type { TAmbiente, TAmbienteMongo } from "../../../controllers/Ambiente/types.js";
import { AmbienteModel } from "../../../models/ambiente-model.js";
import type { IGetAmbienteRepository } from "../../../controllers/Ambiente/get-ambiente/types.js";

export class MongoGetAmbienteRepository implements IGetAmbienteRepository {
  async getAmbiente(id: string): Promise<TAmbiente | null> {
    let AmbienteDoc = null;

    // Primeiro tentamos buscar pelo id da collection do mongo
    if (mongoose.isValidObjectId(id)) {
      AmbienteDoc = await AmbienteModel.findById(id).exec();
    }

    // Se não achou nada, tenta buscar pelo idExterno
    if (!AmbienteDoc) {
      AmbienteDoc = await AmbienteModel.findOne({ idExterno: id }).exec();
    }

    if (!AmbienteDoc) {
      return null;
    }

    const ambienteObj = AmbienteDoc.toObject<TAmbienteMongo>();
    const { _id, __v, ...rest } = ambienteObj;

    return {
      id: _id.toString(),
      ...rest,
    };
  }
}
