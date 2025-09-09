import type {
  ICreateAmbienteRepository,
  TCreateAmbiente,
} from "../../../controllers/ambiente/create-ambiente/types.js";
import { AmbienteModel } from "../../../models/ambiente-model.js";

export class MongoCreateAmbienteRepository implements ICreateAmbienteRepository {
  async createAmbiente(ambiente: TCreateAmbiente): Promise<string> {
    const ambienteModel = new AmbienteModel(ambiente);
    const saved = await ambienteModel.save();
    return saved._id.toString();
  }
}
