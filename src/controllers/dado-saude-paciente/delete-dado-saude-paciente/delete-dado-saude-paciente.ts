import { MongoDeleteDadoSaudePacienteRepository } from "../../../repositories/dado-saude-paciente/delete-dado-saude-paciente/mongo-delete-dado-saude-paciente.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IDeleteDadoSaudePacienteController, IDeleteDadoSaudePacienteRepository } from "./types.js";

export class DeleteDadoSaudePacienteController implements IDeleteDadoSaudePacienteController {
  constructor(
    // private readonly getDadoSaudePacienteRepository: IGetDadoSaudePacienteRepository = new MongoGetPacienteRepository(),
    private readonly deleteDadoSaudePacienteRepository: IDeleteDadoSaudePacienteRepository = new MongoDeleteDadoSaudePacienteRepository(),
  ) {}

  async handle(idRegistro: string, idPaciente: string, authHeader?: string): Promise<void> {
    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);

    // TODO
    // const dadoSaudePaciente = await this.getDadoSaudePacienteRepository.getDadoSaudePaciente(idPaciente, idAplicacao, idAmbiente);
    // if (!dadoSaudePaciente) {
    //   throw new PacienteNotFoundError();
    // }

    await this.deleteDadoSaudePacienteRepository.deleteDadoSaudePaciente(idRegistro, idAplicacao);
  }
}
