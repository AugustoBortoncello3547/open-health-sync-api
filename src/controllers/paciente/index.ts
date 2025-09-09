import type { Document, ObjectId } from "mongoose";

export type TPaciente = {
  id: string;
  idExterno: string;
  dados: Record<string, unknown>;
  criadoEm: Date;
  atualizadoEm: Date;
};

type TPacienteBase = Omit<TPaciente, "id" | "atualizadoEm" | "criadoEm">;

export type TPacienteSchema = TPacienteBase & Document<ObjectId>;

export type TPacienteMongo = TPacienteBase & { _id: string; criadoEm: Date; atualizadoEm: Date };
