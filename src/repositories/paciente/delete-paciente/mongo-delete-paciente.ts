import type { IDeletePacienteRepository } from "../../../controllers/paciente/delete-paciente.ts/types.js";
import { PacienteModel } from "../../../models/paciente-model.js";

export class MongoDeletePacienteRepository implements IDeletePacienteRepository {
  async deletePaciente(idPaciente: string, idAplicacao: string): Promise<boolean> {
    const result = await PacienteModel.deleteOne({
      _id: idPaciente,
      idAplicacao: idAplicacao,
    }).exec();

    return result.deletedCount > 0;
  }
}
