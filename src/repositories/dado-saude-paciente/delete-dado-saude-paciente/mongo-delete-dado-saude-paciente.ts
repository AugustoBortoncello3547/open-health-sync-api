import type { IDeleteDadoSaudePacienteRepository } from "../../../controllers/dado-saude-paciente/delete-dado-saude-paciente/types.js";
import { DadoSaudePacienteModel } from "../../../models/dado-saude-paciente-model.js";

export class MongoDeleteDadoSaudePacienteRepository implements IDeleteDadoSaudePacienteRepository {
  async deleteDadoSaudePaciente(idRegistro: string, idPaciente: string, idAplicacao: string): Promise<boolean> {
    const result = await DadoSaudePacienteModel.deleteOne({
      _id: idRegistro,
      idAplicacao: idAplicacao,
      idPaciente: idPaciente,
    }).exec();

    return result.deletedCount > 0;
  }
}
