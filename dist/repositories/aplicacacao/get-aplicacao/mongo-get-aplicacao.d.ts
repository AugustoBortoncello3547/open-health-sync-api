import type { IGetAplicacaoRepository } from "../../../controllers/aplicacao/get-aplicacao/types";
import type { TAplicacao } from "../../../controllers/aplicacao/types";
export declare class MongoGetAplicacaoRepository implements IGetAplicacaoRepository {
    getAplicacao(id: string): Promise<TAplicacao | null>;
    getAplicacaoByEmail(email: string): Promise<TAplicacao | null>;
    countAplicacoesByEmail(email: string): Promise<number>;
}
//# sourceMappingURL=mongo-get-aplicacao.d.ts.map