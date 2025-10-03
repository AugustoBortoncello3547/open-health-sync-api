import type {
  IUpdatePacienteRepository,
  TUpdatePacienteRequest,
} from "../../../controllers/paciente/update-paciente/types.js";
import { PacienteModel } from "../../../models/paciente-model.js";

export class MongoUpdatePacienteRepository implements IUpdatePacienteRepository {
  async updatePaciente(idPaciente: string, updatePaciente: TUpdatePacienteRequest): Promise<string> {
    const paciente = await PacienteModel.findById(idPaciente);
    if (!paciente) {
      throw new Error("Aplicação não encontrada");
    }

    paciente.set({
      ...updatePaciente,
    });

    const updated = await paciente.save();
    return updated._id.toString();
  }
}
