import type { IDeleteAmbienteRepository } from "../../../controllers/ambiente/delete-ambiente/types.js";
import { AmbienteModel } from "../../../models/ambiente-model.js";

export class MongoDeleteAmbienteRepository implements IDeleteAmbienteRepository {
  async deleteAmbiente(idAmbiente: string, idAplicacao: string): Promise<boolean> {
    const result = await AmbienteModel.deleteOne({
      _id: idAmbiente,
      idAplicacao: idAplicacao,
    }).exec();

    return result.deletedCount > 0;
  }
}
