import type { FilterQuery } from "mongoose";
import type { TAmbiente, TAmbienteResponse, TAmbienteSchema } from "../types";

export interface IListAmbienteController {
  handle(listAmbienteFilters: ListAmbienteParams, authHeader?: string): Promise<TListAmbienteResponse>;
}

export interface IListAmbienteRepository {
  listAmbiente(filters: ListAmbienteParams, idAplicacao: string): Promise<TAmbiente[]>;
}

export type TListAmbienteResponse = {
  registros: TAmbienteResponse[];
  total: number;
  limit: number;
  offset: number;
};

export type ListAmbienteParams = {
  nome: string;
  status: string;
  limit: number;
  offset: number;
};

export type TQueryListAmbiente = FilterQuery<TAmbienteSchema>;
