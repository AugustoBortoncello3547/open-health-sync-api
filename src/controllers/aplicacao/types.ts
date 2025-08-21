import type { StatusAplicacaoEnum } from "../../enums/aplicacao/status-aplicacao-enum.js";
import type { tipoPessoaEnum } from "../../enums/tipo-pessoa-enum.js";
import type { ufEnum } from "../../enums/uf-enum.js";

export type TAplicacao = {
  id: string;
  email: string;
  senha: string;
  status: StatusAplicacaoEnum;
  dados: {
    nome: string;
    tipoPessoa: tipoPessoaEnum;
    cpfCnpj: string;
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
