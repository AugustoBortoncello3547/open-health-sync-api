import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";
import { MongoListDadoSaudePacienteRepository } from "../../../repositories/dado-saude-paciente/list-dado-saude-paciente/mongo-list-dado-saude-paciente.js";
import { MongoGetPacienteRepository } from "../../../repositories/paciente/get-paciente/mongo-get-paciente.js";
import type { IGetPacienteRepository } from "../../paciente/get-paciente/types.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IJwtTokenController } from "../../token/types.js";
import type {
  IListDadoSaudePacienteController,
  IListDadoSaudePacienteRepository,
  ListDadoSaudePacienteParams,
  TListDadoSaudePacienteResponse,
} from "./types.js";

export class ListDadoSaudePacienteController implements IListDadoSaudePacienteController {
  constructor(
    private readonly listDadoSaudePacienteRepository: IListDadoSaudePacienteRepository = new MongoListDadoSaudePacienteRepository(),
    private readonly getPacienteRepository: IGetPacienteRepository = new MongoGetPacienteRepository(),
    private readonly jwtTokenController: IJwtTokenController = new JwtTokenController(),
  ) {}

  async handle(
    idPaciente: string,
    listDadoSaudePacienteFilters: ListDadoSaudePacienteParams,
    authHeader?: string,
  ): Promise<TListDadoSaudePacienteResponse> {
    const { idAplicacao } = await this.jwtTokenController.getTokenData(authHeader);

    const paciente = await this.getPacienteRepository.getPaciente(idPaciente, idAplicacao, undefined);
    if (!paciente) {
      throw new PacienteNotFoundError();
    }

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
