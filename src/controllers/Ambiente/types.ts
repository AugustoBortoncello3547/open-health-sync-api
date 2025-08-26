import type { Document, ObjectId } from "mongoose";
import type { StatusAmbienteEnum } from "../../enums/Ambiente/status-ambiente-enum.js";

export type TAmbiente = {
  id: string;
  idExterno: string;
  idAplicacao: string;
  nome: string;
  status: StatusAmbienteEnum;
  apiKey: string;
  urlWebhook: string;
  tokenWebhook: string;
  criadoEm: Date;
  atualizadoEm: Date;
};

type TAmbienteBase = Omit<TAmbiente, "id" | "atualizadoEm" | "criadoEm">;

export type TAmbienteSchema = TAmbienteBase & Document<ObjectId>;

export type TAmbienteMongo = TAmbienteBase & { _id: string; criadoEm: Date; atualizadoEm: Date };
