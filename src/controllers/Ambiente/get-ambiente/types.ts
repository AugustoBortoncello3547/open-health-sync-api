import type { FastifyReply, FastifyRequest } from "fastify";
import type { TAmbiente } from "../types.js";

export interface IGetAmbienteController {
  handle(
    request: FastifyRequest<{ Params: GetAmbienteParams; Headers: { authorization?: string } }>,
    reply: FastifyReply,
  ): Promise<void>;
}

export interface IGetAmbienteRepository {
  getAmbiente(id: string, idAplicacao: string): Promise<TAmbiente | null>;
  getAmbienteOnlyByIdExterno(idExterno: string, idAplicacao: string): Promise<TAmbiente | null>;
}

export type GetAmbienteParams = {
  idAmbiente: string;
};
