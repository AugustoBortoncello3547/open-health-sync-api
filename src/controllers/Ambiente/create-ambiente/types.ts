import type { StatusAmbienteEnum } from "../../../enums/ambiente/status-ambiente-enum.js";
import type { TAmbiente } from "../types.js";

export interface ICreateAmbienteController {
  handle(createAmbienteRequest: TCreateAmbienteRequest, authHeader?: string): Promise<string>;
}

export type TCreateAmbienteRequest = Omit<
  TAmbiente,
  "id" | "status" | "apiKey" | "idAplicacao" | "atualizadoEm" | "criadoEm"
>;

export type TCreateAmbiente = TCreateAmbienteRequest & {
  status: StatusAmbienteEnum;
  apiKey: string;
  idAplicacao: string;
};

export interface ICreateAmbienteRepository {
  createAmbiente(aplicacacao: TCreateAmbiente): Promise<string>;
}
