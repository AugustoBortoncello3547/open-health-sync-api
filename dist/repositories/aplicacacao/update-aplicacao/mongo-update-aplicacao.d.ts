import type { IUpdateAplicacaoRepository, TUpdateAplicacaoRequest } from "../../../controllers/aplicacao/update-aplicacao/types";
export declare class MongoUpdateAplicacaoRepository implements IUpdateAplicacaoRepository {
    updateAplicacao(idAplicacao: string, updateAplicacao: TUpdateAplicacaoRequest): Promise<string>;
}
//# sourceMappingURL=mongo-update-aplicacao.d.ts.map