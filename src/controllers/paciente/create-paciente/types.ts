import type { TPaciente } from "../index.js";

export interface ICreatePacienteController {
  handle(idAmbiente: string, createPacienteRequest: TCreatePacienteRequest, authHeader?: string): Promise<string>;
}

export type TCreatePacienteRequest = Omit<TPaciente, "id" | "idAmbiente" | "idAplicacao" | "atualizadoEm" | "criadoEm">;

export type TCreatePaciente = TCreatePacienteRequest & {
  idAmbiente: string;
  idAplicacao: string;
};

export interface ICreatePacienteRepository {
  createPaciente(paciente: TCreatePaciente): Promise<string>;
}
