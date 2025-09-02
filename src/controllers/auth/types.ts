import type { FastifyReply, FastifyRequest } from "fastify";
import type { RoleApiEnum } from "../../enums/role-api-enum.js";

export interface IAuthAplicacaoController {
  autenticate(request: FastifyRequest<{ Body: AuthApiParams }>, reply: FastifyReply): Promise<void>;
  verifyToken(
    request: FastifyRequest<{ Headers: { authorization?: string } }>,
    reply: FastifyReply,
    roleToCheck: RoleApiEnum,
  ): Promise<void>;
}

export type AuthApiParams = {
  email: string;
  senha: string;
};
