import type { IGetAplicacaoRepository } from "../get-aplicacao/types";
import type { ICreateAplicacaoController, ICreateAplicacaoRepository, TCreateAplicacaoRequest } from "./types";
export declare class CreateAplicacaoController implements ICreateAplicacaoController {
    private readonly createAplicacaoRepository;
    private readonly getAplicacaoRepository;
    constructor(createAplicacaoRepository?: ICreateAplicacaoRepository, getAplicacaoRepository?: IGetAplicacaoRepository);
    handle(createAplicacaoRequest: TCreateAplicacaoRequest): Promise<string>;
}
//# sourceMappingURL=create-aplicacao.d.ts.map