import type { IGetAmbienteRepository } from "../get-ambiente/types";
import type { IDeleteAmbienteController, IDeleteAmbienteRepository } from "./types";
export declare class DeleteAmbienteController implements IDeleteAmbienteController {
    private readonly getAmbienteRepository;
    private readonly deleteAmbienteRepository;
    constructor(getAmbienteRepository?: IGetAmbienteRepository, deleteAmbienteRepository?: IDeleteAmbienteRepository);
    handle(idAmbiente: string, authHeader?: string): Promise<void>;
}
//# sourceMappingURL=delete-ambiente.d.ts.map