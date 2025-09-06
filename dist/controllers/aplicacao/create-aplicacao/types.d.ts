import type { StatusAplicacaoEnum } from "../../../enums/aplicacao/status-aplicacao-enum";
import type { TAplicacao } from "../types";
export interface ICreateAplicacaoController {
    handle(createAplicacaoRequest: TCreateAplicacaoRequest): Promise<string>;
}
export type TCreateAplicacaoRequest = Omit<TAplicacao, "id" | "status" | "atualizadoEm" | "criadoEm">;
export type TCreateAplicacao = TCreateAplicacaoRequest & {
    status: StatusAplicacaoEnum;
};
export interface ICreateAplicacaoRepository {
    createAplicacao(aplicacacao: TCreateAplicacao): Promise<string>;
}
//# sourceMappingURL=types.d.ts.map