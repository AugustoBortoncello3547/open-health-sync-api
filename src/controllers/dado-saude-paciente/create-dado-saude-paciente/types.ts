import type { TDadoSaudePaciente } from "../types.js";

export interface ICreateDadoSaudePacienteController {
  handle(
    idPaciente: string,
    createDadoSaudePacienteRequest: TCreateDadoSaudePacienteRequest,
    authHeader?: string,
  ): Promise<string>;
}

export type TCreateDadoSaudePacienteRequest = Omit<
  TDadoSaudePaciente,
  "id" | "idPaciente" | "idAplicacao" | "atualizadoEm" | "criadoEm"
>;

export type TCreateDadoSaudePaciente = TCreateDadoSaudePacienteRequest & {
  idPaciente: string;
  idAplicacao: string;
};

export interface ICreateDadoSaudePacienteRepository {
  createDadoSaudePaciente(dadoSaudePaciente: TCreateDadoSaudePaciente): Promise<string>;
}
