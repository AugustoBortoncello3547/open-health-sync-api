import fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import { HttpStatusCode } from "../../enums/http-status-code-enum.js";
import { OpenHealthSyncBaseError } from "../../errors/open-health-sync-api-base-error.js";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";

export function mainApiErrorHandler(err: Error, request: FastifyRequest, reply: FastifyReply) {
  defineCustosErrorsHandler(err, request, reply);
  defineZodErrorsHandler(err, request, reply);
  defineFastifyErrorsHandler(err, request, reply);

  request.log.error({ err }, `Erro desconhecido: ${err.message}`);
  return reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
    error: "InternalServerError",
    message: "Erro interno no servidor",
  });
}

function defineCustosErrorsHandler(err: Error, request: FastifyRequest, reply: FastifyReply) {
  if (err instanceof OpenHealthSyncBaseError) {
    return reply.status(err.statusCode).send({
      error: err.name,
      message: err.message,
    });
  }
}

function defineZodErrorsHandler(err: Error, request: FastifyRequest, reply: FastifyReply) {
  if (hasZodFastifySchemaValidationErrors(err)) {
    return reply.code(HttpStatusCode.BAD_REQUEST).send({
      error: "ValidationError",
      message: "A requisição não bate com o schema",
      statusCode: HttpStatusCode.BAD_REQUEST,
      details: {
        issues: err.validation,
        method: request.method,
        url: request.url,
      },
    });
  }
}

function defineFastifyErrorsHandler(err: Error, request: FastifyRequest, reply: FastifyReply) {
  if (err instanceof fastify.errorCodes.FST_ERR_CTP_INVALID_JSON_BODY) {
    return reply.status(HttpStatusCode.BAD_REQUEST).send({
      error: err.name,
      message: "JSON do corpo da requisição inválido",
    });
  }

  if (err instanceof fastify.errorCodes.FST_ERR_CTP_EMPTY_JSON_BODY) {
    return reply.status(HttpStatusCode.BAD_REQUEST).send({
      error: err.name,
      message: "JSON do corpo da requisição vazio",
    });
  }
}
