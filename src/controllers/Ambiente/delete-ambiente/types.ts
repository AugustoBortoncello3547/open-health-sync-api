import type { FastifyReply, FastifyRequest } from "fastify";

export interface IDeleteAmbienteRepository {
  deleteAmbiente(idAmbiente: string, idAplicacao: string): Promise<boolean>;
}

export interface IDeleteAmbienteController {
  handle(
    request: FastifyRequest<{ Params: DeleteAmbienteParams; Headers: { authorization?: string } }>,
    reply: FastifyReply,
  ): Promise<void>;
}

export type DeleteAmbienteParams = {
  idAmbiente: string;
};
