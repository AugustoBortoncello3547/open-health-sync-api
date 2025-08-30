import type { FastifyReply, FastifyRequest } from "fastify";
import type { TAmbiente, TAmbienteSchema } from "../types.js";
import type { FilterQuery } from "mongoose";

export interface IListAmbienteController {
  handle(
    request: FastifyRequest<{ Querystring: ListAmbienteParams; Headers: { authorization?: string } }>,
    reply: FastifyReply,
  ): Promise<void>;
}

export interface IListAmbienteRepository {
  listAmbiente(filters: ListAmbienteParams, idAplicacao: string): Promise<TAmbiente[]>;
}

export type ListAmbienteParams = {
  nome?: string;
  status?: string;
  limit?: number;
  offset?: number;
};

export type TQueryListAmbiente = FilterQuery<TAmbienteSchema>;
