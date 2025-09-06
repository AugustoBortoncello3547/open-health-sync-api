import { AmbienteModel } from "../../../models/ambiente-model";
export class MongoCreateAmbienteRepository {
    async createAmbiente(aplicacacao) {
        const ambiente = new AmbienteModel(aplicacacao);
        const saved = await ambiente.save();
        return saved._id.toString();
    }
}
//# sourceMappingURL=mongo-create-ambiente.js.map