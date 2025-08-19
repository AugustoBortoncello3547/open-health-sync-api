import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatusCode } from "../../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "../../errors/open-health-sync-api-base-error.js";

export function mainApiErrorHandler(err: Error, req: FastifyRequest, reply: FastifyReply) {
  if (err instanceof OpenHealthSyncBaseError) {
    return reply.status(err.statusCode).send({
      error: err.name,
      message: err.message,
    });
  }

  // Erro não mapeado retornamos uma mensagem genérica
  // e logamos no server
  req.log.error({ err }, `Erro desconhecido: ${err.message}`);
  return reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
    error: "InternalServerError",
    message: "Erro interno no servidor",
  });
}
