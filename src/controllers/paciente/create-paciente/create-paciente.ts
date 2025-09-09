import { PacienteWithIdExternoAlreadyInUseError } from "../../../errors/paciente-with-Id-externo-already-in-use-error.js";
import { MongoCreatePacienteRepository } from "../../../repositories/paciente/create-paciente/mongo-create-paciente.js";
import { MongoGetPacienteRepository } from "../../../repositories/paciente/get-paciente/mongo-get-paciente.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IGetPacienteRepository } from "../get-paciente/types.js";
import type { ICreatePacienteController, ICreatePacienteRepository, TCreatePacienteRequest } from "./types.js";

export class CreatePacienteController implements ICreatePacienteController {
  constructor(
    private readonly createPacienteRepository: ICreatePacienteRepository = new MongoCreatePacienteRepository(),
    private readonly getPacienteRepository: IGetPacienteRepository = new MongoGetPacienteRepository(),
  ) {}

  async handle(createPacienteRequest: TCreatePacienteRequest, authHeader?: string): Promise<string> {
    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);
    const pacienteWithSameIdExterno = await this.getPacienteRepository.getPacienteOnlyByIdExterno(
      createPacienteRequest.idExterno,
      idAplicacao,
    );
    if (pacienteWithSameIdExterno) {
      throw new PacienteWithIdExternoAlreadyInUseError();
    }

    const idPaciente = await this.createPacienteRepository.createPaciente({
      idAplicacao: idAplicacao,
      ...createPacienteRequest,
    });
    return idPaciente;
  }
}
