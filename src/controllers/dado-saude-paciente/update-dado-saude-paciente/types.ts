import type { TDadoSaudePaciente, TDadoSaudePacienteEndpoitsCommonParams } from "../types.js";

export interface IUpdateDadoSaudePacienteController {
  handle(
    idRegistro: string,
    idPaciente: string,
    updateAplicacacaoRequest: TUpdateDadoSaudePacienteRequest,
    authHeader?: string,
  ): Promise<string>;
}

export interface IUpdateDadoSaudePacienteRepository {
  updateDadoSaudePaciente(
    idRegistro: string,
    updateDadoSaudePacienteRequest: TUpdateDadoSaudePacienteRequest,
  ): Promise<string>;
}

export type UpdateDadoSaudePacienteParams = {
  idRegistro: string;
} & TDadoSaudePacienteEndpoitsCommonParams;

export type TUpdateDadoSaudePacienteRequest = Partial<
  Omit<TDadoSaudePaciente, "id" | "idPaciente" | "criadoEm" | "atualizadoEm">
>;
