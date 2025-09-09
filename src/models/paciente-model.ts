import dotenv from "dotenv";
import { Schema, model } from "mongoose";
import encrypt from "mongoose-encryption";
import type { TPacienteSchema } from "../controllers/paciente/index.js";

dotenv.config();

const PacienteSchema = new Schema(
  {
    idExterno: { type: String, required: false },
    idAplicacao: { type: String, required: false },
    dados: { type: Schema.Types.Mixed, required: false },
  },
  {
    timestamps: { createdAt: "criadoEm", updatedAt: "atualizadoEm" },
  },
);

const encKey = process.env.MONGOOSE_ENCRYPT_ENC_KEY || "";
PacienteSchema.plugin(encrypt, {
  secret: encKey,
  encryptedFields: ["dados"],
});

export const PacienteModel = model<TPacienteSchema>("Paciente", PacienteSchema);
