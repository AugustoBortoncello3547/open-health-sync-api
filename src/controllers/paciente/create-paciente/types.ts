import type { TPaciente } from "../index.js";

export interface ICreatePacienteController {
  handle(createPacienteRequest: TCreatePacienteRequest, authHeader?: string): Promise<string>;
}

export type TCreatePacienteRequest = Omit<TPaciente, "id" | "idAplicacao" | "atualizadoEm" | "criadoEm">;

export type TCreatePaciente = TCreatePacienteRequest & {
  idAplicacao: string;
};

export interface ICreatePacienteRepository {
  createPaciente(paciente: TCreatePaciente): Promise<string>;
}
