import type { FastifyReply, FastifyRequest } from "fastify";
import type { TJwtProps } from "../token/types.js";

export interface IAuthAplicacaoController {
  autenticate(request: FastifyRequest<{ Body: AuthApiParams }>, reply: FastifyReply): Promise<void>;
  verifyToken(request: FastifyRequest<{ Headers: { authorization?: string } }>, reply: FastifyReply): Promise<void>;
}

export type AuthApiParams = {
  email: string;
  senha: string;
};
