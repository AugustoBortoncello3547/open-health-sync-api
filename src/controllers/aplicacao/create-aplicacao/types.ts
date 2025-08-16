import type { FastifyReply, FastifyRequest } from "fastify";
import type { StatusAplicacaoEnum } from "../../../enums/aplicacao/status-aplicacao-enum.js";
import type { tipoPessoaEnum } from "../../../enums/tipo-pessoa-enum.js";
import type { ufEnum } from "../../../enums/uf-enum.js";

export interface ICreateAplicaoController {
  handle(request: FastifyRequest<{ Body: CreateAplicacaoParams }>, reply: FastifyReply): Promise<void>;
}

export interface CreateAplicacaoParams {
  usuario: string;
  senha: string;
  status: StatusAplicacaoEnum;
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
  createAplicacao(params: CreateAplicacaoParams): Promise<string>;
}
