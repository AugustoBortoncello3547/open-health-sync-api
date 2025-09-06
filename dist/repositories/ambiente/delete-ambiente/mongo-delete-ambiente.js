import { AmbienteModel } from "../../../models/ambiente-model";
export class MongoDeleteAmbienteRepository {
    async deleteAmbiente(idAmbiente, idAplicacao) {
        const result = await AmbienteModel.deleteOne({
            _id: idAmbiente,
            idAplicacao: idAplicacao,
        }).exec();
        return result.deletedCount > 0;
    }
}
//# sourceMappingURL=mongo-delete-ambiente.js.map