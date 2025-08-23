import dotenv from "dotenv";
import { Schema, model } from "mongoose";
import encrypt from "mongoose-encryption";
import type { TAplicacaoSchema } from "../controllers/aplicacao/get-aplicacao/types.js";
import { StatusAplicacaoEnum } from "../enums/aplicacao/status-aplicacao-enum.js";
import { tipoPessoaEnum } from "../enums/tipo-pessoa-enum.js";
import { ufEnum } from "../enums/uf-enum.js";

dotenv.config();

const EnderecoSchema = new Schema(
  {
    endereco: { type: String, required: false },
    numero: { type: String, required: false },
    bairro: { type: String, required: false },
    complemento: { type: String, required: false },
    cep: { type: String, required: false },
    uf: { type: String, enum: Object.values(ufEnum), required: false },
    cidade: { type: String, required: false },
  },
  {
    _id: false,
  },
);

const DadosSchema = new Schema(
  {
    nome: { type: String, required: false },
    tipoPessoa: { type: String, enum: Object.values(tipoPessoaEnum), required: false },
    cpfCnpj: { type: String, required: false },
    telefone: { type: String, required: false },
    endereco: { type: EnderecoSchema, required: false },
  },
  {
    _id: false,
  },
);

const AplicacaoSchema = new Schema(
  {
    email: { type: String, required: false },
    senha: { type: String, required: false },
    status: { type: String, enum: Object.values(StatusAplicacaoEnum), required: false },
    dados: { type: DadosSchema, required: false },
  },
  {
    timestamps: { createdAt: "criadoEm", updatedAt: "atualizadoEm" },
  },
);

const encKey = process.env.MONGOOSE_ENCRYPT_ENC_KEY || "";
AplicacaoSchema.plugin(encrypt, {
  secret: encKey,
  encryptedFields: ["dados"],
});

export const AplicacaoModel = model<TAplicacaoSchema>("Aplicacao", AplicacaoSchema);
