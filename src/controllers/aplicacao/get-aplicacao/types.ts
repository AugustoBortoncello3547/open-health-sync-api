import type { FastifyReply, FastifyRequest } from "fastify";
import type { Document, ObjectId } from "mongoose";
import type { TAplicacao } from "../types.js";

export interface IGetAplicacaoController {
  handle(request: FastifyRequest<{ Params: GetAplicacaoParams }>, reply: FastifyReply): Promise<void>;
}

export interface IGetAplicacaoRepository {
  getAplicacao(id: string): Promise<TAplicacao | null>;
  getAplicacaoByEmail(email: string): Promise<TAplicacao | null>;
  countAplicacoesByEmail(email: string): Promise<number>;
}

type TAplicacaoBase = Omit<TAplicacao, "id" | "atualizadoEm" | "criadoEm">;

export type TAplicacaoSchema = TAplicacaoBase & Document<ObjectId>;

export type TAplicacaoMongo = TAplicacaoBase & { _id: string; criadoEm: Date; atualizadoEm: Date };

export type GetAplicacaoParams = {
  idAplicacao: string;
};
