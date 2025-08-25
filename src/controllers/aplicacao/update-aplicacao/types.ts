import type { FastifyReply, FastifyRequest } from "fastify";
import type { TAplicacao } from "../types.js";

export interface IUpdateAplicacaoController {
  handle(
    request: FastifyRequest<{ Body: TUpdateAplicacao; Params: TUpdateAplicacaoParams }>,
    reply: FastifyReply,
  ): Promise<void>;
}

export interface IUpdateAplicacaoRepository {
  updateAplicacao(idAplicacao: string, aplicacaoData: TUpdateAplicacao): Promise<string>;
}

export type TUpdateAplicacaoParams = {
  idAplicacao: string;
};

export type TUpdateAplicacao = Partial<Omit<TAplicacao, "id" | "criadoEm" | "atualizadoEm">>;
