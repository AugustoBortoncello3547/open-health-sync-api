import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatusCode } from "../enums/http-status-code-enum.js";

export function notFoundErrorHandlerHook(request: FastifyRequest, reply: FastifyReply) {
  reply.status(HttpStatusCode.NOT_FOUND).send({
    statusCode: HttpStatusCode.NOT_FOUND,
    message: `O recurso '${request.method} ${request.url}' não foi encontrado. Verifique a URL e tente novamente`,
  });
}
