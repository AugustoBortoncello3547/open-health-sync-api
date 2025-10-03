import type {
  IUpdateDadoSaudePacienteRepository,
  TUpdateDadoSaudePacienteRequest,
} from "../../../controllers/dado-saude-paciente/update-dado-saude-paciente/types.js";
import { DadoSaudePacienteModel } from "../../../models/dado-saude-paciente-model.js";

export class MongoUpdateDadoSaudePacienteRepository implements IUpdateDadoSaudePacienteRepository {
  async updateDadoSaudePaciente(
    idRegistro: string,
    updateDadoSaudePaciente: TUpdateDadoSaudePacienteRequest,
  ): Promise<string> {
    const dadoSaudePaciente = await DadoSaudePacienteModel.findById(idRegistro);
    if (!dadoSaudePaciente) {
      throw new Error("Dado de saúde do paciente não encontrado.");
    }

    dadoSaudePaciente.set({
      ...updateDadoSaudePaciente,
    });

    const updated = await dadoSaudePaciente.save();
    return updated._id.toString();
  }
}
