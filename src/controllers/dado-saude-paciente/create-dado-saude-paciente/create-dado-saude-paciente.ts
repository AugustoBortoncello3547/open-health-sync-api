import { MongoCreateDadoSaudePacienteRepository } from "../../../repositories/dado-saude-paciente/create-dado-saude-paciente/mongo-create-dado-saude-paciente.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type {
  ICreateDadoSaudePacienteController,
  ICreateDadoSaudePacienteRepository,
  TCreateDadoSaudePacienteRequest,
} from "./types.js";

export class CreateDadoSaudePacienteController implements ICreateDadoSaudePacienteController {
  constructor(
    private readonly createDadoSaudePacienteRepository: ICreateDadoSaudePacienteRepository = new MongoCreateDadoSaudePacienteRepository(),
  ) {}

  async handle(
    idPaciente: string,
    createDadoSaudePacienteRequest: TCreateDadoSaudePacienteRequest,
    authHeader?: string,
  ): Promise<string> {
    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);

    // TODO: validar idExternoRegistro

    const idRegistro = await this.createDadoSaudePacienteRepository.createDadoSaudePaciente({
      idPaciente: idPaciente,
      idAplicacao: idAplicacao,
      ...createDadoSaudePacienteRequest,
    });
    return idRegistro;
  }
}
