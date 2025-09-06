import type { IGetAplicacaoRepository } from "../get-aplicacao/types";
import type { IUpdateAplicacaoController, IUpdateAplicacaoRepository, TUpdateAplicacaoRequest } from "./types";
export declare class UpdateAplicacaoController implements IUpdateAplicacaoController {
    private readonly getAplicacaoRepository;
    private readonly updateAplicacaoRepository;
    constructor(getAplicacaoRepository?: IGetAplicacaoRepository, updateAplicacaoRepository?: IUpdateAplicacaoRepository);
    handle(idAplicacao: string, updateAplicacacaoRequest: TUpdateAplicacaoRequest): Promise<string>;
    mergeDeep(target: any, source: any): void;
}
//# sourceMappingURL=update-aplicacao.d.ts.map