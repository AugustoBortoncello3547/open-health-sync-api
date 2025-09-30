import { DadoSaudePacienteNotFoundError } from "../../../errors/dado-saude-paciente-not-found-error.js";
import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";
import { MongoGetDadoSaudePacienteRepository } from "../../../repositories/dado-saude-paciente/get-dado-saude-paciente/mongo-get-dado-saude-paciente.js";
import { MongoGetPacienteRepository } from "../../../repositories/paciente/get-paciente/mongo-get-paciente.js";
import type { IGetPacienteRepository } from "../../paciente/get-paciente/types.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IJwtTokenController } from "../../token/types.js";
import type { TDadoSaudePacienteResponse } from "../types.js";
import type { IGetDadoSaudePacienteController, IGetDadoSaudePacienteRepository } from "./types.js";

export class GetDadoSaudePacienteController implements IGetDadoSaudePacienteController {
  constructor(
    private readonly getDadoSaudePacienteRepository: IGetDadoSaudePacienteRepository = new MongoGetDadoSaudePacienteRepository(),
    private readonly getPacienteRepository: IGetPacienteRepository = new MongoGetPacienteRepository(),
    private readonly jwtTokenController: IJwtTokenController = new JwtTokenController(),
  ) {}

  async handle(idRegistro: string, idPaciente: string, authHeader?: string): Promise<TDadoSaudePacienteResponse> {
    const { idAplicacao } = await this.jwtTokenController.getTokenData(authHeader);

    const paciente = await this.getPacienteRepository.getPaciente(idPaciente, idAplicacao, undefined);
    if (!paciente) {
      throw new PacienteNotFoundError();
    }

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
