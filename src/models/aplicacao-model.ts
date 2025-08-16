import { Schema, model } from "mongoose";
import { ufEnum } from "../enums/uf-enum.js";
import { tipoPessoaEnum } from "../enums/tipo-pessoa-enum.js";
import { StatusAplicacaoEnum } from "../enums/aplicacao/status-aplicacao-enum.js";

const EnderecoSchema = new Schema(
  {
    endereco: { type: String, required: true },
    numero: { type: String, required: true },
    bairro: { type: String, required: true },
    complemento: { type: String },
    cep: { type: String, required: true },
    uf: { type: String, enum: Object.values(ufEnum), required: true },
    cidade: { type: String, required: true },
  },
  {
    _id: false,
  },
);

const DadosSchema = new Schema(
  {
    nome: { type: String, required: true },
    tipoPessoa: { type: String, enum: Object.values(tipoPessoaEnum), required: true },
    cpfCnpj: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    endereco: { type: EnderecoSchema, required: true },
  },
  {
    _id: false,
  },
);

const AplicacaoSchema = new Schema(
  {
    usuario: { type: String, required: true },
    senha: { type: String, required: true },
    status: { type: String, enum: Object.values(StatusAplicacaoEnum), required: true },
    dados: { type: DadosSchema, required: true },
  },
  {
    timestamps: { createdAt: "criadoEm", updatedAt: "atualizadoEm" },
  },
);

export const AplicacaoModel = model("Aplicacao", AplicacaoSchema);
