import fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { HttpStatusCode } from "../../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "../../errors/open-health-sync-api-base-error.js";

export function mainApiErrorHandler(err: Error, request: FastifyRequest, reply: FastifyReply) {
  if (defineCustosErrorsHandler(err, request, reply)) return;
  if (defineZodErrorsHandler(err, request, reply)) return;
  if (defineFastifyErrorsHandler(err, request, reply)) return;

  request.log.error({ err }, `Erro desconhecido: ${err.message}`);
  return reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
    error: "InternalServerError",
    message: "Erro interno no servidor",
  });
}

function defineCustosErrorsHandler(err: Error, request: FastifyRequest, reply: FastifyReply): boolean {
  if (err instanceof OpenHealthSyncBaseError) {
    reply.status(err.statusCode).send({
      error: err.name,
      message: err.message,
    });
    return true;
  }
  return false;
}

function defineZodErrorsHandler(err: Error, request: FastifyRequest, reply: FastifyReply): boolean {
  if (hasZodFastifySchemaValidationErrors(err)) {
    reply.code(HttpStatusCode.BAD_REQUEST).send({
      error: "ValidationError",
      message: "A requisição não bate com o schema",
      statusCode: HttpStatusCode.BAD_REQUEST,
      details: {
        issues: err.validation,
        method: request.method,
        url: request.url,
      },
    });
    return true;
  }
  return false;
}

function defineFastifyErrorsHandler(err: Error, request: FastifyRequest, reply: FastifyReply): boolean {
  if (err instanceof fastify.errorCodes.FST_ERR_CTP_INVALID_JSON_BODY) {
    reply.status(HttpStatusCode.BAD_REQUEST).send({
      error: err.name,
      message: "JSON do corpo da requisição inválido",
    });
    return true;
  }

  if (err instanceof fastify.errorCodes.FST_ERR_CTP_EMPTY_JSON_BODY) {
    reply.status(HttpStatusCode.BAD_REQUEST).send({
      error: err.name,
      message: "JSON do corpo da requisição vazio",
    });
    return true;
  }

  return false;
}
