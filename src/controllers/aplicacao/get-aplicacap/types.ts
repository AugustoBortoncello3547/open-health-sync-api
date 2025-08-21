import type { FastifyReply, FastifyRequest } from "fastify";
import type { Document, ObjectId } from "mongoose";
import type { TAplicacao } from "../types.js";

export interface IGetAplicaoController {
  handle(request: FastifyRequest<{ Params: GetAplicacaoParams }>, reply: FastifyReply): Promise<void>;
}

export interface IGetAplicaoRepository {
  getAplicacao(id: string): Promise<TAplicacao | null>;
  getAplicaoByUsuario(usuario: string): Promise<TAplicacao | null>;
}

type TAplicacaoBase = Omit<TAplicacao, "id" | "atualizadoEm" | "criadoEm">;

export type TAplicacaoSchema = TAplicacaoBase & Document<ObjectId>;

export type TAplicacaoMongo = TAplicacaoBase & { _id: string; criadoEm: Date; atualizadoEm: Date };

export type GetAplicacaoParams = {
  idAplicacao: string;
};
