import type { TAplicacao } from "../types";
export interface IGetAplicacaoController {
    handle(idAplicacao: string): Promise<TAplicacaoResponse>;
}
export interface IGetAplicacaoRepository {
    getAplicacao(id: string): Promise<TAplicacao | null>;
    getAplicacaoByEmail(email: string): Promise<TAplicacao | null>;
    countAplicacoesByEmail(email: string): Promise<number>;
}
export type TAplicacaoResponse = Omit<TAplicacao, "criadoEm" | "atualizadoEm"> & {
    criadoEm: string;
    atualizadoEm: string;
};
export type GetAplicacaoParams = {
    idAplicacao: string;
};
//# sourceMappingURL=types.d.ts.map