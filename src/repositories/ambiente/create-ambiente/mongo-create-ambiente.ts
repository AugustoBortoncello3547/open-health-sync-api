import type {
  ICreateAmbienteRepository,
  TCreateAmbiente,
} from "../../../controllers/ambiente/create-ambiente/types.js";
import { AmbienteModel } from "../../../models/ambiente-model.js";

export class MongoCreateAmbienteRepository implements ICreateAmbienteRepository {
  async createAmbiente(aplicacacao: TCreateAmbiente): Promise<string> {
    const ambiente = new AmbienteModel(aplicacacao);
    const saved = await ambiente.save();
    return saved._id.toString();
  }
}
