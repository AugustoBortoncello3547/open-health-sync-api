import type { IListAmbienteRepository, ListAmbienteParams } from "../../../controllers/ambiente/list-ambiente/types";
import type { TAmbiente } from "../../../controllers/ambiente/types";
export declare class MongoListAmbienteRepository implements IListAmbienteRepository {
    listAmbiente(filters: Required<ListAmbienteParams>, idAplicacao: string): Promise<TAmbiente[]>;
}
//# sourceMappingURL=mongo-list-ambiente.d.ts.map