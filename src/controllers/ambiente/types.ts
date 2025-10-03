import type { Document, ObjectId } from "mongoose";
import type { StatusAmbienteEnum } from "../../enums/ambiente/status-ambiente-enum.js";

export type TAmbiente = {
  id: string;
  idExterno: string;
  idAplicacao: string;
  nome: string;
  status: StatusAmbienteEnum;
  urlWebhook: string;
  tokenWebhook: string;
  criadoEm: Date;
  atualizadoEm: Date;
};

export type TAmbienteResponse = Omit<TAmbiente, "criadoEm" | "atualizadoEm"> & {
  criadoEm: string;
  atualizadoEm: string;
};

type TAmbienteBase = Omit<TAmbiente, "id" | "atualizadoEm" | "criadoEm">;

export type TAmbienteSchema = TAmbienteBase & Document<ObjectId>;

export type TAmbienteMongo = TAmbienteBase & { _id: string; criadoEm: Date; atualizadoEm: Date };
