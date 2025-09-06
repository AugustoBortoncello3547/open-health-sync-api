export interface IDeleteAmbienteRepository {
  deleteAmbiente(idAmbiente: string, idAplicacao: string): Promise<boolean>;
}

export interface IDeleteAmbienteController {
  handle(idAmbiente: string, authHeader?: string): Promise<void>;
}

export type TDeleteAmbienteParams = {
  idAmbiente: string;
};
