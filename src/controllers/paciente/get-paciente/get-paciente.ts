import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";
import { MongoGetPacienteRepository } from "../../../repositories/paciente/get-paciente/mongo-get-paciente.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { TPacienteResponse } from "../index.js";
import type { IGetPacienteController, IGetPacienteRepository } from "./types.js";

export class GetPacienteController implements IGetPacienteController {
  constructor(private readonly getPacienteRepository: IGetPacienteRepository = new MongoGetPacienteRepository()) {}

  async handle(idPaciente: string, authHeader?: string): Promise<TPacienteResponse> {
    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);

    const paciente = await this.getPacienteRepository.getPaciente(idPaciente, idAplicacao);
    if (!paciente) {
      throw new PacienteNotFoundError();
    }

    return {
      ...paciente,
      atualizadoEm: paciente.atualizadoEm.toISOString(),
      criadoEm: paciente.criadoEm.toISOString(),
    };
  }
}
