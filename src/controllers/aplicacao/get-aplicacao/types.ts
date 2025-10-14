import type { TAplicacao } from "../types.js";

export interface IGetAplicacaoController {
  handle(idAplicacao: string): Promise<TAplicacaoResponse>;
}

export interface IGetAplicacaoRepository {
  getAplicacao(idAplicacao: string): Promise<TAplicacao | null>;
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
