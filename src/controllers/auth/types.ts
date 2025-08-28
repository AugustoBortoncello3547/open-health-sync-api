import type { FastifyReply, FastifyRequest } from "fastify";

export interface IAuthAplicacaoController {
  autenticate(request: FastifyRequest<{ Body: AuthApiParams }>, reply: FastifyReply): Promise<void>;
  verifyToken(request: FastifyRequest<{ Headers: { authorization?: string } }>, reply: FastifyReply): Promise<void>;
  extractDatafromToken(token: string): Promise<TJwtProps | null>;
}

export type AuthApiParams = {
  email: string;
  senha: string;
};

export type TJwtProps = {
  idAplicacao: string;
  email: string;
};
