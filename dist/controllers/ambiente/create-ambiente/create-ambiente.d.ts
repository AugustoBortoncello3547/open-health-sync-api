import type { IGetAmbienteRepository } from "../get-ambiente/types";
import type { ICreateAmbienteController, ICreateAmbienteRepository, TCreateAmbienteRequest } from "./types";
export declare class CreateAmbienteController implements ICreateAmbienteController {
    private readonly createAmbienteRepository;
    private readonly getAmbienteRepository;
    constructor(createAmbienteRepository?: ICreateAmbienteRepository, getAmbienteRepository?: IGetAmbienteRepository);
    handle(createAmbienteRequest: TCreateAmbienteRequest, authHeader?: string): Promise<string>;
    generateAmbienteApiKey(): Promise<string>;
}
//# sourceMappingURL=create-ambiente.d.ts.map