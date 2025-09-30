import { DadoSaudePacienteNotFoundError } from "../../../errors/dado-saude-paciente-not-found-error.js";
import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";
import { MongoDeleteDadoSaudePacienteRepository } from "../../../repositories/dado-saude-paciente/delete-dado-saude-paciente/mongo-delete-dado-saude-paciente.js";
import { MongoGetDadoSaudePacienteRepository } from "../../../repositories/dado-saude-paciente/get-dado-saude-paciente/mongo-get-dado-saude-paciente.js";
import { MongoGetPacienteRepository } from "../../../repositories/paciente/get-paciente/mongo-get-paciente.js";
import type { IGetPacienteRepository } from "../../paciente/get-paciente/types.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IJwtTokenController } from "../../token/types.js";
import type { IGetDadoSaudePacienteRepository } from "../get-dado-saude-paciente/types.js";
import type { IDeleteDadoSaudePacienteController, IDeleteDadoSaudePacienteRepository } from "./types.js";

export class DeleteDadoSaudePacienteController implements IDeleteDadoSaudePacienteController {
  constructor(
    private readonly getDadoSaudePacienteRepository: IGetDadoSaudePacienteRepository = new MongoGetDadoSaudePacienteRepository(),
    private readonly deleteDadoSaudePacienteRepository: IDeleteDadoSaudePacienteRepository = new MongoDeleteDadoSaudePacienteRepository(),
    private readonly getPacienteRepository: IGetPacienteRepository = new MongoGetPacienteRepository(),
    private readonly jwtTokenController: IJwtTokenController = new JwtTokenController(),
  ) {}

  async handle(idRegistro: string, idPaciente: string, authHeader?: string): Promise<void> {
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

    await this.deleteDadoSaudePacienteRepository.deleteDadoSaudePaciente(idRegistro, idAplicacao);
  }
}
