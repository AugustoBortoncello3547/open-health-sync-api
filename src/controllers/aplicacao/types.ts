import type { Document, ObjectId } from "mongoose";
import type { StatusAplicacaoEnum } from "../../enums/aplicacao/status-aplicacao-enum.js";
import type { TipoPessoaEnum } from "../../enums/tipo-pessoa-enum.js";
import type { UfEnum } from "../../enums/uf-enum.js";

export type TAplicacao = {
  id: string;
  email: string;
  senha: string;
  status: StatusAplicacaoEnum;
  dados: {
    nome: string;
    tipoPessoa: TipoPessoaEnum;
    cpfCnpj: string;
    telefone: string;
    endereco: {
      endereco: string;
      numero: string;
      bairro: string;
      complemento: string;
      cep: string;
      uf: UfEnum;
      cidade: string;
    };
  };
  criadoEm: Date;
  atualizadoEm: Date;
};

type TAplicacaoBase = Omit<TAplicacao, "id" | "atualizadoEm" | "criadoEm">;

export type TAplicacaoSchema = TAplicacaoBase & Document<ObjectId>;

export type TAplicacaoMongo = TAplicacaoBase & { _id: string; criadoEm: Date; atualizadoEm: Date };
