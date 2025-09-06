import fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { HttpStatusCodeEnum } from "../enums/http-status-code-enum";
import { OpenHealthSyncBaseError } from "../errors/open-health-sync-api-base-error";

export function globalErrorHandlerHook(err: Error, request: FastifyRequest, reply: FastifyReply) {
  if (defineCustosErrorsHandler(err, request, reply)) return;
  if (defineZodErrorsHandler(err, request, reply)) return;
  if (defineFastifyErrorsHandler(err, request, reply)) return;

  request.log.error({ err }, `Erro desconhecido: ${err.message}`);
  return reply.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).send({
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
    reply.code(HttpStatusCodeEnum.BAD_REQUEST).send({
      error: "ValidationError",
      message: "A requisição não bate com o schema",
      statusCode: HttpStatusCodeEnum.BAD_REQUEST,
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
    reply.status(HttpStatusCodeEnum.BAD_REQUEST).send({
      error: err.name,
      message: "JSON do corpo da requisição inválido",
    });
    return true;
  }

  if (err instanceof fastify.errorCodes.FST_ERR_CTP_EMPTY_JSON_BODY) {
    reply.status(HttpStatusCodeEnum.BAD_REQUEST).send({
      error: err.name,
      message: "JSON do corpo da requisição vazio",
    });
    return true;
  }

  return false;
}
