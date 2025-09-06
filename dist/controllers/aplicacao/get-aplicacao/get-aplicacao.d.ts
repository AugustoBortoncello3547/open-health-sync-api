import type { IGetAplicacaoController, IGetAplicacaoRepository, TAplicacaoResponse } from "./types";
export declare class GetAplicacaoController implements IGetAplicacaoController {
    private readonly getAplicacaoRepository;
    constructor(getAplicacaoRepository?: IGetAplicacaoRepository);
    handle(idAplicacao: string): Promise<TAplicacaoResponse>;
}
//# sourceMappingURL=get-aplicacao.d.ts.map