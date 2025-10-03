import { DadoSaudePacienteNotFoundError } from "../../../errors/dado-saude-paciente-not-found-error.js";
import { DadoSaudePacienteWithIdExternoAlreadyInUseError } from "../../../errors/dado-saude-paciente-with-Id-externo-already-in-use-error.js";
import { MongoGetDadoSaudePacienteRepository } from "../../../repositories/dado-saude-paciente/get-dado-saude-paciente/mongo-get-dado-saude-paciente.js";
import { MongoUpdateDadoSaudePacienteRepository } from "../../../repositories/dado-saude-paciente/update-dado-saude-paciente/mongo-update-dado-saude-paciente.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IJwtTokenController } from "../../token/types.js";
import type { IGetDadoSaudePacienteRepository } from "../get-dado-saude-paciente/types.js";
import type {
  IUpdateDadoSaudePacienteController,
  IUpdateDadoSaudePacienteRepository,
  TUpdateDadoSaudePacienteRequest,
} from "./types.js";

export class UpdateDadoSaudePacienteController implements IUpdateDadoSaudePacienteController {
  constructor(
    private readonly getDadoSaudePacienteRepository: IGetDadoSaudePacienteRepository = new MongoGetDadoSaudePacienteRepository(),
    private readonly updateDadoSaudePacienteRepository: IUpdateDadoSaudePacienteRepository = new MongoUpdateDadoSaudePacienteRepository(),
    private readonly jwtTokenController: IJwtTokenController = new JwtTokenController(),
  ) {}

  async handle(
    idRegistro: string,
    idPaciente: string,
    updateDadoSaudePacienteRequest: TUpdateDadoSaudePacienteRequest,
    authHeader?: string,
  ): Promise<string> {
    const { idAplicacao } = await this.jwtTokenController.getTokenData(authHeader);

    const dadoSaudePaciente = await this.getDadoSaudePacienteRepository.getDadoSaudePaciente(
      idRegistro,
      idAplicacao,
      idPaciente,
    );
    if (!dadoSaudePaciente) {
      throw new DadoSaudePacienteNotFoundError();
    }

    const { idExterno, dados } = updateDadoSaudePacienteRequest;
    if (idExterno) {
      const dadoSaudePacienteWithSameIdExterno =
        await this.getDadoSaudePacienteRepository.getDadoSaudePacienteOnlyByIdExterno(
          idExterno,
          idAplicacao,
          idPaciente,
        );
      if (dadoSaudePacienteWithSameIdExterno) {
        throw new DadoSaudePacienteWithIdExternoAlreadyInUseError();
      }

      dadoSaudePaciente.idExterno = idExterno;
    }

    if (dados) {
      dadoSaudePaciente.dados = dados;
    }

    const idUpdatedPaciente = await this.updateDadoSaudePacienteRepository.updateDadoSaudePaciente(
      dadoSaudePaciente.id,
      dadoSaudePaciente,
    );
    return idUpdatedPaciente;
  }
}
