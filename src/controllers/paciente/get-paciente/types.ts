import type { TPaciente, TPacienteResponse } from "../index.js";

export interface IGetPacienteController {
  handle(idPaciente: string, authHeader?: string): Promise<TPacienteResponse>;
}

export interface IGetPacienteRepository {
  getPaciente(id: string, idAplicacao: string): Promise<TPaciente | null>;
  getPacienteOnlyByIdExterno(idExterno: string, idAplicacao: string): Promise<TPaciente | null>;
}

export type GetPacienteParams = {
  idPaciente: string;
};
