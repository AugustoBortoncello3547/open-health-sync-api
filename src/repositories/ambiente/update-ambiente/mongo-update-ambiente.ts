import type {
  IUpdateAmbienteRepository,
  TUpdateAmbienteRequest,
} from "../../../controllers/ambiente/update-ambiente/types.js";
import { AmbienteNotFoundError } from "../../../errors/ambiente-not-found-error.js";
import { AmbienteModel } from "../../../models/ambiente-model.js";

export class MongoUpdateAmbienteRepository implements IUpdateAmbienteRepository {
  async updateAmbiente(idAmbiente: string, updateAmbiente: TUpdateAmbienteRequest): Promise<string> {
    const result = await AmbienteModel.updateOne({ _id: idAmbiente }, { $set: updateAmbiente });

    if (result.matchedCount === 0) {
      throw new AmbienteNotFoundError();
    }

    return idAmbiente;
  }
}
