import dotenv from "dotenv";
import { Schema, model } from "mongoose";
import encrypt from "mongoose-encryption";
import type { TDadoSaudePacienteSchema } from "../controllers/dado-saude-paciente/types.js";

dotenv.config();

const DadoSaudePacienteSchema = new Schema(
  {
    idAplicacao: { type: String, required: false },
    idPaciente: { type: String, required: false },
    idExterno: { type: String, required: false },
    dados: { type: Schema.Types.Mixed, required: false },
  },
  {
    timestamps: { createdAt: "criadoEm", updatedAt: "atualizadoEm" },
  },
);

const encKey = process.env.MONGOOSE_ENCRYPT_ENC_KEY || "";
DadoSaudePacienteSchema.plugin(encrypt, {
  secret: encKey,
  encryptedFields: ["dados"],
});

export const DadoSaudePacienteModel = model<TDadoSaudePacienteSchema>("Dado_Saude_Paciente", DadoSaudePacienteSchema);
