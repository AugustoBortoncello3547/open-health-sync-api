import type { FilterQuery } from "mongoose";
import type { TPaciente, TPacienteResponse, TPacienteSchema } from "../index.js";
import type { TipoDataFiltroEnum } from "../../../enums/tipo-data-filtro-enum.js";

export interface IListPacienteController {
  handle(listPacienteFilters: ListPacienteParams, authHeader?: string): Promise<TListPacienteResponse>;
}

export interface IListPacienteRepository {
  listPaciente(filters: ListPacienteParams, idAplicacao: string): Promise<TPaciente[]>;
}

export type TListPacienteResponse = {
  registros: TPacienteResponse[];
  total: number;
  limit: number;
  offset: number;
};

export type ListPacienteParams = {
  tipoData: TipoDataFiltroEnum;
  dataInicial: string;
  dataFinal: string;
  limit: number;
  offset: number;
};

export type TQueryListPaciente = FilterQuery<TPacienteSchema>;
