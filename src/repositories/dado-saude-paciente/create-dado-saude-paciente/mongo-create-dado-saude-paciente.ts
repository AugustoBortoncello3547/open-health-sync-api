import type {
  ICreateDadoSaudePacienteRepository,
  TCreateDadoSaudePaciente,
} from "../../../controllers/dado-saude-paciente/create-dado-saude-paciente/types.js";
import { DadoSaudePacienteModel } from "../../../models/dado-saude-paciente-model.js";

export class MongoCreateDadoSaudePacienteRepository implements ICreateDadoSaudePacienteRepository {
  async createDadoSaudePaciente(dadoSaudePaciente: TCreateDadoSaudePaciente): Promise<string> {
    const dadoSaudePacienteModel = new DadoSaudePacienteModel(dadoSaudePaciente);
    const saved = await dadoSaudePacienteModel.save();
    return saved._id.toString();
  }
}
