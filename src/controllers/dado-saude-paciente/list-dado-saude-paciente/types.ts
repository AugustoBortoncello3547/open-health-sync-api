import type { FilterQuery } from "mongoose";
import type { TipoDataFiltroEnum } from "../../../enums/tipo-data-filtro-enum.js";
import type { TDadoSaudePaciente, TDadoSaudePacienteResponse, TDadoSaudePacienteSchema } from "../types.js";

export interface IListDadoSaudePacienteController {
  handle(
    idPaciente: string,
    listDadoSaudePacienteFilters: ListDadoSaudePacienteParams,
    authHeader?: string,
  ): Promise<TListDadoSaudePacienteResponse>;
}

export interface IListDadoSaudePacienteRepository {
  listDadoSaudePaciente(
    filters: ListDadoSaudePacienteParams,
    idAplicacao: string,
    idAmbiente: string,
  ): Promise<TDadoSaudePaciente[]>;
}

export type TListDadoSaudePacienteResponse = {
  registros: TDadoSaudePacienteResponse[];
  total: number;
  limit: number;
  offset: number;
};

export type ListDadoSaudePacienteParams = {
  tipoData?: TipoDataFiltroEnum;
  dataInicial?: string;
  dataFinal?: string;
  limit: number;
  offset: number;
};

export type TQueryListDadoSaudePaciente = FilterQuery<TDadoSaudePacienteSchema>;
