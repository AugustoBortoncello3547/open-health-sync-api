import type { ICreateAmbienteRepository, TCreateAmbiente } from "../../../controllers/Ambiente/create-ambiente/types";
import { AmbienteModel } from "../../../models/ambiente-model";

export class MongoCreateAmbienteRepository implements ICreateAmbienteRepository {
  async createAmbiente(aplicacacao: TCreateAmbiente): Promise<string> {
    const ambiente = new AmbienteModel(aplicacacao);
    const saved = await ambiente.save();
    return saved._id.toString();
  }
}
