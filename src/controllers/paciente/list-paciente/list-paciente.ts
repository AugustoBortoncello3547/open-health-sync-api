import { MongoListPacienteRepository } from "../../../repositories/paciente/list-paciente/mongo-list-paciente.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type {
  IListPacienteController,
  IListPacienteRepository,
  ListPacienteParams,
  TListPacienteResponse,
} from "./types.js";

export class ListPacienteController implements IListPacienteController {
  constructor(private readonly listPacienteRepository: IListPacienteRepository = new MongoListPacienteRepository()) {}

  async handle(listPacienteFilters: ListPacienteParams, authHeader?: string): Promise<TListPacienteResponse> {
    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);

    const pacientes = await this.listPacienteRepository.listPaciente(listPacienteFilters, idAplicacao);
    const normalizedPacientes = pacientes.map((paciente) => {
      return {
        ...paciente,
        atualizadoEm: paciente.atualizadoEm.toISOString(),
        criadoEm: paciente.criadoEm.toISOString(),
      };
    });

    return {
      registros: normalizedPacientes,
      total: pacientes.length,
      limit: listPacienteFilters.limit,
      offset: listPacienteFilters.offset,
    };
  }
}
