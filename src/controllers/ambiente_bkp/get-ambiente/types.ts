import type { TAmbiente, TAmbienteResponse } from "../types";

export interface IGetAmbienteController {
  handle(idAmbiente: string, authHeader?: string): Promise<TAmbienteResponse>;
}

export interface IGetAmbienteRepository {
  getAmbiente(id: string, idAplicacao: string): Promise<TAmbiente | null>;
  getAmbienteOnlyByIdExterno(idExterno: string, idAplicacao: string): Promise<TAmbiente | null>;
}

export type GetAmbienteParams = {
  idAmbiente: string;
};
