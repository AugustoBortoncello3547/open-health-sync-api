export interface IDeletePacienteRepository {
  deletePaciente(idPaciente: string, idAplicacao: string): Promise<boolean>;
}

export interface IDeletePacienteController {
  handle(idPaciente: string, authHeader?: string): Promise<void>;
}

export type TDeletePacienteParams = {
  idPaciente: string;
};
