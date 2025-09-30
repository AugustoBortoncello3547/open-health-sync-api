import { DadoSaudePacienteWithIdExternoAlreadyInUseError } from "../../../errors/dado-saude-paciente-with-Id-externo-already-in-use-error.js";
import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";
import { MongoCreateDadoSaudePacienteRepository } from "../../../repositories/dado-saude-paciente/create-dado-saude-paciente/mongo-create-dado-saude-paciente.js";
import { MongoGetDadoSaudePacienteRepository } from "../../../repositories/dado-saude-paciente/get-dado-saude-paciente/mongo-get-dado-saude-paciente.js";
import { MongoGetPacienteRepository } from "../../../repositories/paciente/get-paciente/mongo-get-paciente.js";
import type { IGetPacienteRepository } from "../../paciente/get-paciente/types.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IJwtTokenController } from "../../token/types.js";
import type { IGetDadoSaudePacienteRepository } from "../get-dado-saude-paciente/types.js";
import type {
  ICreateDadoSaudePacienteController,
  ICreateDadoSaudePacienteRepository,
  TCreateDadoSaudePacienteRequest,
} from "./types.js";

export class CreateDadoSaudePacienteController implements ICreateDadoSaudePacienteController {
  constructor(
    private readonly createDadoSaudePacienteRepository: ICreateDadoSaudePacienteRepository = new MongoCreateDadoSaudePacienteRepository(),
    private readonly getDadoSaudePacienteRepository: IGetDadoSaudePacienteRepository = new MongoGetDadoSaudePacienteRepository(),
    private readonly getPacienteRepository: IGetPacienteRepository = new MongoGetPacienteRepository(),
    private readonly jwtTokenController: IJwtTokenController = new JwtTokenController(),
  ) {}

  async handle(
    idPaciente: string,
    createDadoSaudePacienteRequest: TCreateDadoSaudePacienteRequest,
    authHeader?: string,
  ): Promise<string> {
    const { idAplicacao } = await this.jwtTokenController.getTokenData(authHeader);

    const paciente = await this.getPacienteRepository.getPaciente(idPaciente, idAplicacao, undefined);
    if (!paciente) {
      throw new PacienteNotFoundError();
    }

    const dadosSaudepacienteWithSameIdExterno =
      await this.getDadoSaudePacienteRepository.getDadoSaudePacienteOnlyByIdExterno(
        createDadoSaudePacienteRequest.idExterno,
        idAplicacao,
        idPaciente,
      );
    if (dadosSaudepacienteWithSameIdExterno) {
      throw new DadoSaudePacienteWithIdExternoAlreadyInUseError();
    }

    const idRegistro = await this.createDadoSaudePacienteRepository.createDadoSaudePaciente({
      idPaciente: idPaciente,
      idAplicacao: idAplicacao,
      ...createDadoSaudePacienteRequest,
    });
    return idRegistro;
  }
}
