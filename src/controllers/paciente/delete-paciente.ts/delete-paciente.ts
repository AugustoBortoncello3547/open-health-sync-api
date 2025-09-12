import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";
import { MongoDeletePacienteRepository } from "../../../repositories/paciente/delete-paciente/mongo-delete-paciente.js";
import { MongoGetPacienteRepository } from "../../../repositories/paciente/get-paciente/mongo-get-paciente.js";
import { GetAmbienteController } from "../../ambiente/get-ambiente/get-ambiente.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IGetPacienteRepository } from "../get-paciente/types.js";
import type { IDeletePacienteController, IDeletePacienteRepository } from "./types.js";

export class DeletePacienteController implements IDeletePacienteController {
  constructor(
    private readonly getPacienteRepository: IGetPacienteRepository = new MongoGetPacienteRepository(),
    private readonly deletePacienteRepository: IDeletePacienteRepository = new MongoDeletePacienteRepository(),
  ) {}

  async handle(idAmbiente: string, idPaciente: string, authHeader?: string): Promise<void> {
    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);

    const getAmbienteController = new GetAmbienteController();
    await getAmbienteController.validateAmbienteIsAvailable(idAmbiente, idAplicacao);

    const paciente = await this.getPacienteRepository.getPaciente(idPaciente, idAplicacao, idAmbiente);
    if (!paciente) {
      throw new PacienteNotFoundError();
    }

    await this.deletePacienteRepository.deletePaciente(paciente.id, idAplicacao);
  }
}
