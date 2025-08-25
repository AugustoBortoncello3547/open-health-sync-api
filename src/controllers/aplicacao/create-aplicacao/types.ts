import type { FastifyReply, FastifyRequest } from "fastify";
import type { StatusAplicacaoEnum } from "../../../enums/aplicacao/status-aplicacao-enum.js";
import type { TAplicacao } from "../types.js";

export interface ICreateAplicacaoController {
  handle(request: FastifyRequest<{ Body: TCreateAplicacaoParams }>, reply: FastifyReply): Promise<void>;
}

export type TCreateAplicacaoParams = Omit<TAplicacao, "id" | "status" | "atualizadoEm" | "criadoEm">;

export type TCreateAplicacao = TCreateAplicacaoParams & {
  status: StatusAplicacaoEnum;
};

export interface ICreateAplicacaoRepository {
  createAplicacao(aplicacacao: TCreateAplicacao): Promise<string>;
}
