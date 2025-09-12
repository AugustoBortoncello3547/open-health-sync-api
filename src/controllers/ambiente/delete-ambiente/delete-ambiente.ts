import { AmbienteNotFoundError } from "../../../errors/ambiente-not-found-error.js";
import { AmbienteWithPacientesError } from "../../../errors/ambiente-with-pacientes-error.js";
import { MongoDeleteAmbienteRepository } from "../../../repositories/ambiente/delete-ambiente/mongo-delete-ambiente.js";
import { MongoGetAmbienteRepository } from "../../../repositories/ambiente/get-ambiente/mongo-get-ambiente.js";
import { MongoListPacienteRepository } from "../../../repositories/paciente/list-paciente/mongo-list-paciente.js";
import type { IListPacienteRepository } from "../../paciente/list-paciente/types.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IGetAmbienteRepository } from "../get-ambiente/types.js";
import type { IDeleteAmbienteController, IDeleteAmbienteRepository } from "./types.js";

export class DeleteAmbienteController implements IDeleteAmbienteController {
  constructor(
    private readonly getAmbienteRepository: IGetAmbienteRepository = new MongoGetAmbienteRepository(),
    private readonly deleteAmbienteRepository: IDeleteAmbienteRepository = new MongoDeleteAmbienteRepository(),
    private readonly listPacienteRepository: IListPacienteRepository = new MongoListPacienteRepository(),
  ) {}

  async handle(idAmbiente: string, authHeader?: string): Promise<void> {
    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);

    const ambiente = await this.getAmbienteRepository.getAmbiente(idAmbiente, idAplicacao);
    if (!ambiente) {
      throw new AmbienteNotFoundError();
    }

    const pacientes = await this.listPacienteRepository.listPaciente(
      {
        offset: 0,
        limit: 1,
      },
      idAplicacao,
      idAmbiente,
    );
    const hasPacientesOnThisAmbiente = pacientes.length === 1;
    if (hasPacientesOnThisAmbiente) {
      throw new AmbienteWithPacientesError();
    }

    await this.deleteAmbienteRepository.deleteAmbiente(ambiente.id, idAplicacao);
  }
}
