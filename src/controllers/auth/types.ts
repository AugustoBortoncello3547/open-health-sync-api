import type { FastifyReply, FastifyRequest } from "fastify";

export interface IAuthAplicaoController {
  autenticate(request: FastifyRequest<{ Body: AuthApiParams }>, reply: FastifyReply): Promise<void>;
}

export type AuthApiParams = {
  email: string;
  senha: string;
};
