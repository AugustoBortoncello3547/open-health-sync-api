import { DadoSaudePacienteNotFoundError } from "../../../errors/dado-saude-paciente-not-found-error.js";
import { MongoGetDadoSaudePacienteRepository } from "../../../repositories/dado-saude-paciente/get-dado-saude-paciente/mongo-get-dado-saude-paciente.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { TDadoSaudePacienteResponse } from "../types.js";
import type { IGetDadoSaudePacienteController, IGetDadoSaudePacienteRepository } from "./types.js";

export class GetDadoSaudePacienteController implements IGetDadoSaudePacienteController {
  constructor(
    private readonly getDadoSaudePacienteRepository: IGetDadoSaudePacienteRepository = new MongoGetDadoSaudePacienteRepository(),
  ) {}

  async handle(idRegistro: string, idPaciente: string, authHeader?: string): Promise<TDadoSaudePacienteResponse> {
    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);

    const dadoSaudePaciente = await this.getDadoSaudePacienteRepository.getDadoSaudePaciente(
      idRegistro,
      idAplicacao,
      idPaciente,
    );
    if (!dadoSaudePaciente) {
      throw new DadoSaudePacienteNotFoundError();
    }

    return {
      ...dadoSaudePaciente,
      atualizadoEm: dadoSaudePaciente.atualizadoEm.toISOString(),
      criadoEm: dadoSaudePaciente.criadoEm.toISOString(),
    };
  }
}
