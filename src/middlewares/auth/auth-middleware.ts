import type { FastifyReply, FastifyRequest } from "fastify";
import { MongoGetAplicacaoRepository } from "../../repositories/aplicacacao/get-aplicacao/mongo-get-aplicacao.js";
import { AuthApiController } from "../../controllers/auth/auth-api-controller.js";

export async function authMiddleware(
  request: FastifyRequest<{ Headers: { authorization?: string } }>,
  reply: FastifyReply,
) {
  const mongoGetAplicacaoRepository = new MongoGetAplicacaoRepository();
  const authApiController = new AuthApiController(mongoGetAplicacaoRepository);
  return authApiController.verifyToken(request, reply);
}
