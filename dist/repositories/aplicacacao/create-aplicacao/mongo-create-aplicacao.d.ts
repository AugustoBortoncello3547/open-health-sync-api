import type { ICreateAplicacaoRepository, TCreateAplicacao } from "../../../controllers/aplicacao/create-aplicacao/types";
export declare class MongoCreateAplicacaoRepository implements ICreateAplicacaoRepository {
    createAplicacao(aplicacacao: TCreateAplicacao): Promise<string>;
}
//# sourceMappingURL=mongo-create-aplicacao.d.ts.map