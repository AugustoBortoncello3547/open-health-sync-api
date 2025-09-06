import type { TAmbienteResponse } from "../types";
import type { IGetAmbienteController, IGetAmbienteRepository } from "./types";
export declare class GetAmbienteController implements IGetAmbienteController {
    private readonly getAmbienteRepository;
    constructor(getAmbienteRepository?: IGetAmbienteRepository);
    handle(idAmbiente: string, authHeader?: string): Promise<TAmbienteResponse>;
}
//# sourceMappingURL=get-ambiente.d.ts.map