import { MongoListDadoSaudePacienteRepository } from "../../../repositories/dado-saude-paciente/list-dado-saude-paciente/mongo-list-dado-saude-paciente.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type {
  IListDadoSaudePacienteController,
  IListDadoSaudePacienteRepository,
  ListDadoSaudePacienteParams,
  TListDadoSaudePacienteResponse,
} from "./types.js";

export class ListDadoSaudePacienteController implements IListDadoSaudePacienteController {
  constructor(
    private readonly listDadoSaudePacienteRepository: IListDadoSaudePacienteRepository = new MongoListDadoSaudePacienteRepository(),
  ) {}

  async handle(
    idPaciente: string,
    listDadoSaudePacienteFilters: ListDadoSaudePacienteParams,
    authHeader?: string,
  ): Promise<TListDadoSaudePacienteResponse> {
    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);

    const dadosSaudePacientes = await this.listDadoSaudePacienteRepository.listDadoSaudePaciente(
      listDadoSaudePacienteFilters,
      idAplicacao,
      idPaciente,
    );
    const normalizedDadosSaudePacientes = dadosSaudePacientes.map((dadoSaudePaciente) => {
      return {
        ...dadoSaudePaciente,
        atualizadoEm: dadoSaudePaciente.atualizadoEm.toISOString(),
        criadoEm: dadoSaudePaciente.criadoEm.toISOString(),
      };
    });

    return {
      registros: normalizedDadosSaudePacientes,
      total: normalizedDadosSaudePacientes.length,
      limit: listDadoSaudePacienteFilters.limit,
      offset: listDadoSaudePacienteFilters.offset,
    };
  }
}
