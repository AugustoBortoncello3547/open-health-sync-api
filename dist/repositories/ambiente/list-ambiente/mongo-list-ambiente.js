import { AmbienteModel } from "../../../models/ambiente-model";
export class MongoListAmbienteRepository {
    async listAmbiente(filters, idAplicacao) {
        const { nome, status, limit, offset } = filters;
        const query = { idAplicacao };
        if (nome) {
            // busca parcial, case-insensitive
            query.nome = { $regex: nome, $options: "i" };
        }
        if (status) {
            query.status = status;
        }
        const ambientes = await AmbienteModel.find(query).skip(offset).limit(limit).exec();
        return ambientes.map((item) => {
            const ambienteObj = item.toObject();
            const { _id, __v, ...rest } = ambienteObj;
            return {
                id: _id.toString(),
                ...rest,
            };
        });
    }
}
//# sourceMappingURL=mongo-list-ambiente.js.map