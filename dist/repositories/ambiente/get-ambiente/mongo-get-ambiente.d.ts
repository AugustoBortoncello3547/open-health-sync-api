import type { TAmbiente } from "../../../controllers/ambiente/types";
import type { IGetAmbienteRepository } from "../../../controllers/ambiente/get-ambiente/types";
export declare class MongoGetAmbienteRepository implements IGetAmbienteRepository {
    getAmbiente(id: string, idAplicacao: string): Promise<TAmbiente | null>;
    getAmbienteOnlyByIdExterno(idExterno: string, idAplicacao: string): Promise<TAmbiente | null>;
}
//# sourceMappingURL=mongo-get-ambiente.d.ts.map