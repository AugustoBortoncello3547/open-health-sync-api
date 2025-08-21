import type { FastifyReply, FastifyRequest } from "fastify";
import type { tipoPessoaEnum } from "../../../enums/tipo-pessoa-enum.js";
import type { ufEnum } from "../../../enums/uf-enum.js";
import type { StatusAplicacaoEnum } from "../../../enums/aplicacao/status-aplicacao-enum.js";

export interface ICreateAplicaoController {
  handle(request: FastifyRequest<{ Body: TCreateAplicacaoParams }>, reply: FastifyReply): Promise<void>;
}
export type TCreateAplicacao = TCreateAplicacaoParams & {
  status: StatusAplicacaoEnum;
};
export interface TCreateAplicacaoParams {
  usuario: string;
  senha: string;
  dados: {
    nome: string;
    tipoPessoa: tipoPessoaEnum;
    cpfCnpj: string;
    email: string;
    telefone: string;
    endereco: {
      endereco: string;
      numero: string;
      bairro: string;
      complemento: string;
      cep: string;
      uf: ufEnum;
      cidade: string;
    };
  };
}

export interface ICreateAplicaoRepository {
  createAplicacao(aplicacacao: TCreateAplicacao): Promise<string>;
}
