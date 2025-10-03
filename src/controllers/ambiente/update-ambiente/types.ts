import type { TAmbiente } from "../types.js";

export interface IUpdateAmbienteController {
  handle(idAmbiente: string, updateAplicacacaoRequest: TUpdateAmbienteRequest): Promise<string>;
}

export interface IUpdateAmbienteRepository {
  updateAmbiente(idAmbiente: string, updateAplicacacaoRequest: TUpdateAmbienteRequest): Promise<string>;
}

export type TUpdateAmbienteParams = {
  idAmbiente: string;
};

export type TUpdateAmbienteRequest = Partial<Omit<TAmbiente, "id" | "criadoEm" | "atualizadoEm">>;
