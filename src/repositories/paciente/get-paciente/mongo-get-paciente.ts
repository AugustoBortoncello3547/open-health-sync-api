import mongoose from "mongoose";
import type { IGetPacienteRepository } from "../../../controllers/paciente/get-paciente/types.js";
import type { TPaciente, TPacienteMongo } from "../../../controllers/paciente/index.js";
import { PacienteModel } from "../../../models/paciente-model.js";
import type { TQueryPaciente } from "../../../controllers/paciente/list-paciente/types.js";

export class MongoGetPacienteRepository implements IGetPacienteRepository {
  async getPaciente(idPaciente: string, idAplicacao: string, idAmbiente?: string): Promise<TPaciente | null> {
    let pacienteDoc = null;

    let query: TQueryPaciente = {
      _id: idPaciente,
      idAplicacao,
    };

    if (idAmbiente) {
      query = { ...query, idAmbiente };
    }

    // Primeiro tentamos buscar pelo id da collection do mongo
    if (mongoose.isValidObjectId(idPaciente)) {
      pacienteDoc = await PacienteModel.findOne(query).exec();
    }

    // Se não achou nada, tenta buscar pelo idExterno
    if (!pacienteDoc) {
      return await this.getPacienteOnlyByIdExterno(idPaciente, idAplicacao, idAmbiente);
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
    let query: TQueryPaciente = {
      idExterno,
      idAplicacao,
    };

    if (idAmbiente) {
      query = { ...query, idAmbiente };
    }

    const pacienteDoc = await PacienteModel.findOne(query).exec();
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
