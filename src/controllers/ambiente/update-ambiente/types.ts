import type { TAmbiente } from "../types.js";

export interface IUpdateAmbienteController {
  handle(idAmbiente: string, updateAmbienteRequest: TUpdateAmbienteRequest, authHeader?: string): Promise<string>;
}

export interface IUpdateAmbienteRepository {
  updateAmbiente(idAmbiente: string, updateAmbienteRequest: TUpdateAmbienteRequest): Promise<string>;
}

export type TUpdateAmbienteParams = {
  idAmbiente: string;
};

export type TUpdateAmbienteRequest = Partial<Omit<TAmbiente, "id" | "criadoEm" | "atualizadoEm">>;
