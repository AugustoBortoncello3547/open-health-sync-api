import type {
  ICreatePacienteRepository,
  TCreatePaciente,
} from "../../../controllers/paciente/create-paciente/types.js";
import { PacienteModel } from "../../../models/paciente-model.js";

export class MongoCreatePacienteRepository implements ICreatePacienteRepository {
  async createPaciente(paciente: TCreatePaciente): Promise<string> {
    const pacienteModel = new PacienteModel(paciente);
    const saved = await pacienteModel.save();
    return saved._id.toString();
  }
}
