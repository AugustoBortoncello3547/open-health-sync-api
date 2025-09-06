import type { IListAmbienteController, IListAmbienteRepository, ListAmbienteParams, TListAmbienteResponse } from "./types";
export declare class ListAmbienteController implements IListAmbienteController {
    private readonly listAmbienteRepository;
    constructor(listAmbienteRepository?: IListAmbienteRepository);
    handle(listAmbienteFilters: ListAmbienteParams, authHeader?: string): Promise<TListAmbienteResponse>;
}
//# sourceMappingURL=list-ambiente.d.ts.map