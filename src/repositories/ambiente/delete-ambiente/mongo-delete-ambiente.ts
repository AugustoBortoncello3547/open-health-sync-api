import type { IDeleteAmbienteRepository } from "../../../controllers/ambiente_bkp/delete-ambiente/types";
import { AmbienteModel } from "../../../models/ambiente-model";

export class MongoDeleteAmbienteRepository implements IDeleteAmbienteRepository {
  async deleteAmbiente(idAmbiente: string, idAplicacao: string): Promise<boolean> {
    const result = await AmbienteModel.deleteOne({
      _id: idAmbiente,
      idAplicacao: idAplicacao,
    }).exec();

    return result.deletedCount > 0;
  }
}
