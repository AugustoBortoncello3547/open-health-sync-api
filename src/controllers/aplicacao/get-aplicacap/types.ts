import type { FastifyReply, FastifyRequest } from "fastify";
import type { StatusAplicacaoEnum } from "../../../enums/aplicacao/status-aplicacao-enum.js";
import type { tipoPessoaEnum } from "../../../enums/tipo-pessoa-enum.js";
import type { ufEnum } from "../../../enums/uf-enum.js";
import type { Document, ObjectId } from "mongoose";

export interface IGetAplicaoController {
  handle(request: FastifyRequest<{ Params: GetAplicacaoParams }>, reply: FastifyReply): Promise<void>;
}

export interface IGetAplicaoRepository {
  getAplicacao(id: string): Promise<Aplicacao | null>;
  getAplicaoByUsuario(usuario: string): Promise<Aplicacao | null>;
}

export type AplicacaoBase = {
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
};

export type Aplicacao = AplicacaoBase & {
  id: string;
  criadoEm: Date;
  atualizadoEm: Date;
};

export type TAplicacaoSchema = AplicacaoBase & Document<ObjectId>;

export type TAplicacaoMongo = AplicacaoBase & { _id: string; criadoEm: Date; atualizadoEm: Date };

export type GetAplicacaoParams = {
  idAplicacao: string;
};
