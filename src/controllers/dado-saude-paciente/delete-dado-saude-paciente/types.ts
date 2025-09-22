import type { TDadoSaudePacienteEndpoitsCommonParams } from "../types.js";

export interface IDeleteDadoSaudePacienteRepository {
  deleteDadoSaudePaciente(idRegistro: string, idAplicacao: string): Promise<boolean>;
}

export interface IDeleteDadoSaudePacienteController {
  handle(idRegistro: string, idPaciente: string, authHeader?: string): Promise<void>;
}

export type TDeleteDadoSaudePacienteParams = {
  idRegistro: string;
} & TDadoSaudePacienteEndpoitsCommonParams;
