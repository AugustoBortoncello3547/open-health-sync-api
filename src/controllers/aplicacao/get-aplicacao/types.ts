import type { FastifyReply, FastifyRequest } from "fastify";
import type { TAplicacao } from "../types.js";

export interface IGetAplicacaoController {
  handle(request: FastifyRequest<{ Params: GetAplicacaoParams }>, reply: FastifyReply): Promise<void>;
}

export interface IGetAplicacaoRepository {
  getAplicacao(id: string): Promise<TAplicacao | null>;
  getAplicacaoByEmail(email: string): Promise<TAplicacao | null>;
  countAplicacoesByEmail(email: string): Promise<number>;
}

export type GetAplicacaoParams = {
  idAplicacao: string;
};
