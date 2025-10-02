import type { TAplicacao } from "../types.js";

export interface IUpdateAplicacaoController {
  handle(idAplicacao: string, updateAplicacacaoRequest: TUpdateAplicacaoRequest): Promise<string>;
}

export interface IUpdateAplicacaoRepository {
  updateAplicacao(idAplicacao: string, updateAplicacacaoRequest: TUpdateAplicacaoRequest): Promise<string>;
}

export type TUpdateAplicacaoParams = {
  idAplicacao: string;
};

export type TUpdateAplicacaoRequest = Partial<
  Omit<TAplicacao, "id" | "status" | "senha" | "criadoEm" | "atualizadoEm">
>;
