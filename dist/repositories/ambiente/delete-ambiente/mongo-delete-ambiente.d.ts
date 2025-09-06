import type { IDeleteAmbienteRepository } from "../../../controllers/ambiente/delete-ambiente/types";
export declare class MongoDeleteAmbienteRepository implements IDeleteAmbienteRepository {
    deleteAmbiente(idAmbiente: string, idAplicacao: string): Promise<boolean>;
}
//# sourceMappingURL=mongo-delete-ambiente.d.ts.map