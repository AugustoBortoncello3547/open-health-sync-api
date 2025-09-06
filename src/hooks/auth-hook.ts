import type { FastifyReply, FastifyRequest } from "fastify";
import { MongoGetAplicacaoRepository } from "../repositories/aplicacacao/get-aplicacao/mongo-get-aplicacao";
import { AuthApiController } from "../controllers/auth/auth-api-controller";
import { RoleApiEnum } from "../enums/role-api-enum";

export async function authHook(request: FastifyRequest<{ Headers: { authorization?: string } }>, reply: FastifyReply) {
  const mongoGetAplicacaoRepository = new MongoGetAplicacaoRepository();
  const authApiController = new AuthApiController(mongoGetAplicacaoRepository);
  return authApiController.verifyToken(request, reply, RoleApiEnum.USER);
}
