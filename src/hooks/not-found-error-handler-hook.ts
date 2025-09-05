import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatusCodeEnum } from "../enums/http-status-code-enum";

export function notFoundErrorHandlerHook(request: FastifyRequest, reply: FastifyReply) {
  reply.status(HttpStatusCodeEnum.NOT_FOUND).send({
    statusCode: HttpStatusCodeEnum.NOT_FOUND,
    message: `O recurso '${request.method} ${request.url}' não foi encontrado. Verifique a URL e tente novamente`,
  });
}
