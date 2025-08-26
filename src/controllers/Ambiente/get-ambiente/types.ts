import type { FastifyReply, FastifyRequest } from "fastify";
import type { TAmbiente } from "../types.js";

export interface IGetAmbienteController {
  handle(request: FastifyRequest<{ Params: GetAmbienteParams }>, reply: FastifyReply): Promise<void>;
}

export interface IGetAmbienteRepository {
  getAmbiente(id: string): Promise<TAmbiente | null>;
  getAmbienteOnlyByIdExterno(idExterno: string): Promise<TAmbiente | null>;
}

export type GetAmbienteParams = {
  idAmbiente: string;
};
