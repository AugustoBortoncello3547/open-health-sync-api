import dotenv from "dotenv";
import { Schema, model } from "mongoose";
import encrypt from "mongoose-encryption";
import type { TAmbienteSchema } from "../controllers/ambiente/types.js";
import { StatusAmbienteEnum } from "../enums/ambiente/status-ambiente-enum.js";

dotenv.config();

const AmbienteSchema = new Schema(
  {
    idExterno: { type: String, required: false },
    idAplicacao: { type: String, required: false },
    nome: { type: String, required: false },
    status: { type: String, enum: Object.values(StatusAmbienteEnum), required: false },
    urlWebhook: { type: String, required: false },
    tokenWebhook: { type: String, required: false },
  },
  {
    timestamps: { createdAt: "criadoEm", updatedAt: "atualizadoEm" },
  },
);

const encKey = process.env.MONGOOSE_ENCRYPT_ENC_KEY || "";
AmbienteSchema.plugin(encrypt, {
  secret: encKey,
  encryptedFields: ["urlWebhook", "tokenWebhook"],
});

export const AmbienteModel = model<TAmbienteSchema>("Ambiente", AmbienteSchema);
