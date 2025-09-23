import mongoose from "mongoose";
import type { IGetDadoSaudePacienteRepository } from "../../../controllers/dado-saude-paciente/get-dado-saude-paciente/types.js";
import type { TDadoSaudePaciente, TDadoSaudePacienteMongo } from "../../../controllers/dado-saude-paciente/types.js";
import { DadoSaudePacienteModel } from "../../../models/dado-saude-paciente-model.js";

export class MongoGetDadoSaudePacienteRepository implements IGetDadoSaudePacienteRepository {
  async getDadoSaudePaciente(
    idRegistro: string,
    idAplicacao: string,
    idPaciente: string,
  ): Promise<TDadoSaudePaciente | null> {
    let dadoSaudePacienteDoc = null;

    // Primeiro tentamos buscar pelo id da collection do mongo
    if (mongoose.isValidObjectId(idRegistro)) {
      dadoSaudePacienteDoc = await DadoSaudePacienteModel.findOne({
        _id: idRegistro,
        idAplicacao,
        idPaciente,
      }).exec();
    }

    // Se não achou nada, tenta buscar pelo idExterno
    if (!dadoSaudePacienteDoc) {
      return await this.getDadoSaudePacienteOnlyByIdExterno(idRegistro, idAplicacao, idPaciente);
    }

    if (!dadoSaudePacienteDoc) {
      return null;
    }

    const dadoSaudePacienteObj = dadoSaudePacienteDoc.toObject<TDadoSaudePacienteMongo>();
    const { _id, __v, ...rest } = dadoSaudePacienteObj;

    return {
      id: _id.toString(),
      ...rest,
    };
  }

  async getDadoSaudePacienteOnlyByIdExterno(
    idExterno: string,
    idAplicacao: string,
    idPaciente: string,
  ): Promise<TDadoSaudePaciente | null> {
    const dadoSaudePacienteDoc = await DadoSaudePacienteModel.findOne({ idExterno, idAplicacao, idPaciente }).exec();
    if (!dadoSaudePacienteDoc) {
      return null;
    }

    const dadoSaudePacienteObj = dadoSaudePacienteDoc.toObject<TDadoSaudePacienteMongo>();
    const { _id, __v, ...rest } = dadoSaudePacienteObj;

    return {
      id: _id.toString(),
      ...rest,
    };
  }
}
