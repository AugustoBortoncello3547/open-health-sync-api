import type { Document, ObjectId } from "mongoose";

export type TDadoSaudePaciente = {
  id: string;
  idPaciente: string;
  idExterno: string;
  dados: Record<string, unknown>;
  criadoEm: Date;
  atualizadoEm: Date;
};

export type TDadoSaudePacienteResponse = Omit<TDadoSaudePaciente, "criadoEm" | "atualizadoEm"> & {
  criadoEm: string;
  atualizadoEm: string;
};

export type TDadoSaudePacienteEndpoitsCommonParams = {
  idPaciente: string;
};

type TDadoSaudePacienteBase = Omit<TDadoSaudePaciente, "id" | "atualizadoEm" | "criadoEm">;

export type TDadoSaudePacienteSchema = TDadoSaudePacienteBase & Document<ObjectId>;

export type TDadoSaudePacienteMongo = TDadoSaudePacienteBase & { _id: string; criadoEm: Date; atualizadoEm: Date };
