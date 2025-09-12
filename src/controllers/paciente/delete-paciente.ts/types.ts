import type { TPacienteEndpoitsCommonParams } from "../index.js";

export interface IDeletePacienteRepository {
  deletePaciente(idPaciente: string, idAplicacao: string): Promise<boolean>;
}

export interface IDeletePacienteController {
  handle(idAmbiente: string, idPaciente: string, authHeader?: string): Promise<void>;
}

export type TDeletePacienteParams = {
  idPaciente: string;
} & TPacienteEndpoitsCommonParams;
