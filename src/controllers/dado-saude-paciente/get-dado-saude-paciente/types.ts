import type {
  TDadoSaudePaciente,
  TDadoSaudePacienteEndpoitsCommonParams,
  TDadoSaudePacienteResponse,
} from "../types.js";

export interface IGetDadoSaudePacienteController {
  handle(idRegistro: string, idPaciente: string, authHeader?: string): Promise<TDadoSaudePacienteResponse>;
}

export interface IGetDadoSaudePacienteRepository {
  getDadoSaudePaciente(idRegistro: string, idAplicacao: string, idPaciente: string): Promise<TDadoSaudePaciente | null>;
  getDadoSaudePacienteOnlyByIdExterno(
    idExterno: string,
    idAplicacao: string,
    idPaciente: string,
  ): Promise<TDadoSaudePaciente | null>;
}

export type GetDadoSaudePacienteParams = {
  idRegistro: string;
} & TDadoSaudePacienteEndpoitsCommonParams;
