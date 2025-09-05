import type { FastifyReply, FastifyRequest } from "fastify";
import type { RoleApiEnum } from "../../enums/role-api-enum";

export interface IAuthAplicacaoController {
  autenticate(email: string, senha: string): Promise<TResponseAutenticate>;
  verifyToken(
    request: FastifyRequest<{ Headers: { authorization?: string } }>,
    reply: FastifyReply,
    roleToCheck: RoleApiEnum,
  ): Promise<void>;
}

export type TResponseAutenticate = {
  token: string;
  expiresIn: number;
  expiresAt: Date;
};

export type AuthApiParams = {
  email: string;
  senha: string;
};
