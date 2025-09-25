import mongoose from "mongoose";
import type { IGetPacienteRepository } from "../../../controllers/paciente/get-paciente/types.js";
import type { TPaciente, TPacienteMongo } from "../../../controllers/paciente/index.js";
import { PacienteModel } from "../../../models/paciente-model.js";

export class MongoGetPacienteRepository implements IGetPacienteRepository {
  async getPaciente(id: string, idAplicacao: string, idAmbiente?: string): Promise<TPaciente | null> {
    let pacienteDoc = null;

    // Primeiro tentamos buscar pelo id da collection do mongo
    if (mongoose.isValidObjectId(id)) {
      pacienteDoc = await PacienteModel.findOne({
        _id: id,
        idAmbiente,
        idAplicacao,
      }).exec();
    }

    // Se não achou nada, tenta buscar pelo idExterno
    if (!pacienteDoc) {
      return await this.getPacienteOnlyByIdExterno(id, idAplicacao, idAmbiente);
    }

    if (!pacienteDoc) {
      return null;
    }

    const pacienteObj = pacienteDoc.toObject<TPacienteMongo>();
    const { _id, __v, ...rest } = pacienteObj;

    return {
      id: _id.toString(),
      ...rest,
    };
  }

  async getPacienteOnlyByIdExterno(
    idExterno: string,
    idAplicacao: string,
    idAmbiente?: string,
  ): Promise<TPaciente | null> {
    const pacienteDoc = await PacienteModel.findOne({ idAmbiente, idExterno, idAplicacao }).exec();
    if (!pacienteDoc) {
      return null;
    }

    const pacienteObj = pacienteDoc.toObject<TPacienteMongo>();
    const { _id, __v, ...rest } = pacienteObj;

    return {
      id: _id.toString(),
      ...rest,
    };
  }
}
