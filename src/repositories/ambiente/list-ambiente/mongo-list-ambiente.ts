import type {
  IListAmbienteRepository,
  ListAmbienteParams,
  TQueryListAmbiente,
} from "../../../controllers/Ambiente/list-ambiente/types";
import type { TAmbiente, TAmbienteMongo } from "../../../controllers/Ambiente/types";
import { AmbienteModel } from "../../../models/ambiente-model";

export class MongoListAmbienteRepository implements IListAmbienteRepository {
  async listAmbiente(filters: Required<ListAmbienteParams>, idAplicacao: string): Promise<TAmbiente[]> {
    const { nome, status, limit, offset } = filters;

    const query: TQueryListAmbiente = { idAplicacao };
    if (nome) {
      // busca parcial, case-insensitive
      query.nome = { $regex: nome, $options: "i" };
    }

    if (status) {
      query.status = status;
    }

    const ambientes = await AmbienteModel.find(query).skip(offset).limit(limit).exec();

    return ambientes.map((item) => {
      const ambienteObj = item.toObject<TAmbienteMongo>();
      const { _id, __v, ...rest } = ambienteObj;
      return {
        id: _id.toString(),
        ...rest,
      };
    });
  }
}
