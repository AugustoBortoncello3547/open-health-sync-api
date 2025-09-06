import type { StatusAmbienteEnum } from "../../../enums/ambiente_tmp/status-ambiente-enum";
import type { TAmbiente } from "../types";

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
