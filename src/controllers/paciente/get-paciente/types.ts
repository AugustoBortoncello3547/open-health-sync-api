import type { TPaciente, TPacienteEndpoitsCommonParams, TPacienteResponse } from "../index.js";

export interface IGetPacienteController {
  handle(idAmbiente: string, idPaciente: string, authHeader?: string): Promise<TPacienteResponse>;
}

export interface IGetPacienteRepository {
  getPaciente(id: string, idAplicacao: string, idAmbiente: string): Promise<TPaciente | null>;
  getPacienteOnlyByIdExterno(idExterno: string, idAplicacao: string, idAmbiente: string): Promise<TPaciente | null>;
}

export type GetPacienteParams = {
  idPaciente: string;
} & TPacienteEndpoitsCommonParams;
