import type { TPaciente, TPacienteEndpoitsCommonParams } from "../index.js";

export interface IUpdatePacienteController {
  handle(
    idPaciente: string,
    idAmbiente: string,
    updateAplicacacaoRequest: TUpdatePacienteRequest,
    authHeader?: string,
  ): Promise<string>;
}

export interface IUpdatePacienteRepository {
  updatePaciente(idPaciente: string, updateAplicacacaoRequest: TUpdatePacienteRequest): Promise<string>;
}

export type UpdatePacienteParams = {
  idPaciente: string;
} & TPacienteEndpoitsCommonParams;

export type TUpdatePacienteRequest = Partial<Omit<TPaciente, "id" | "idAmbiente" | "criadoEm" | "atualizadoEm">>;
