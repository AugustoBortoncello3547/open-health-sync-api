import type { Document, ObjectId } from "mongoose";

export type TPaciente = {
  id: string;
  idAmbiente: string;
  idExterno: string;
  dados: Record<string, unknown>;
  criadoEm: Date;
  atualizadoEm: Date;
};

export type TPacienteResponse = Omit<TPaciente, "criadoEm" | "atualizadoEm"> & {
  criadoEm: string;
  atualizadoEm: string;
};

export type TPacienteEndpoitsCommonParams = {
  idAmbiente: string;
};

type TPacienteBase = Omit<TPaciente, "id" | "atualizadoEm" | "criadoEm">;

export type TPacienteSchema = TPacienteBase & Document<ObjectId>;

export type TPacienteMongo = TPacienteBase & { _id: string; criadoEm: Date; atualizadoEm: Date };
