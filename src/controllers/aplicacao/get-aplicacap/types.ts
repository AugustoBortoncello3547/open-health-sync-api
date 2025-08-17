import type { FastifyReply, FastifyRequest } from "fastify";
import type { StatusAplicacaoEnum } from "../../../enums/aplicacao/status-aplicacao-enum.js";
import type { tipoPessoaEnum } from "../../../enums/tipo-pessoa-enum.js";
import type { ufEnum } from "../../../enums/uf-enum.js";

export interface IGetAplicaoController {
  handle(request: FastifyRequest<{ Params: GetAplicacaoParams }>, reply: FastifyReply): Promise<void>;
}

export type TAplicacaoMongo = Omit<Aplicacao & { _id: string }, "id">;

export type Aplicacao = {
  id: string;
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
  criadoEm: Date;
  atualizadoEm: Date;
};

export type GetAplicacaoParams = {
  idAplicacao: string;
};

export interface IGetAplicaoRepository {
  getAplicacao(id: string): Promise<Aplicacao>;
}
