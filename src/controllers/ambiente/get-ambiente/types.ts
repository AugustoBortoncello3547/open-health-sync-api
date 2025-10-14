import type { TAmbiente, TAmbienteResponse } from "../types.js";

export interface IGetAmbienteController {
  handle(idAmbiente: string, authHeader?: string): Promise<TAmbienteResponse>;
  validateAmbienteIsAvailable(idAmbiente: string, idAplicacao: string): Promise<void>;
}

export interface IGetAmbienteRepository {
  getAmbiente(idAmbiente: string, idAplicacao: string): Promise<TAmbiente | null>;
  getAmbienteOnlyByIdExterno(idExterno: string, idAplicacao: string): Promise<TAmbiente | null>;
}

export type GetAmbienteParams = {
  idAmbiente: string;
};
