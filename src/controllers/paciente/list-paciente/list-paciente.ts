import { MongoListPacienteRepository } from "../../../repositories/paciente/list-paciente/mongo-list-paciente.js";
import { GetAmbienteController } from "../../ambiente/get-ambiente/get-ambiente.js";
import type { IGetAmbienteController } from "../../ambiente/get-ambiente/types.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IJwtTokenController } from "../../token/types.js";
import type {
  IListPacienteController,
  IListPacienteRepository,
  ListPacienteParams,
  TListPacienteResponse,
} from "./types.js";

export class ListPacienteController implements IListPacienteController {
  constructor(
    private readonly listPacienteRepository: IListPacienteRepository = new MongoListPacienteRepository(),
    private readonly getAmbienteController: IGetAmbienteController = new GetAmbienteController(),
    private readonly jwtTokenController: IJwtTokenController = new JwtTokenController(),
  ) {}

  async handle(
    idAmbiente: string,
    listPacienteFilters: ListPacienteParams,
    authHeader?: string,
  ): Promise<TListPacienteResponse> {
    const { idAplicacao } = await this.jwtTokenController.getTokenData(authHeader);

    await this.getAmbienteController.validateAmbienteIsAvailable(idAmbiente, idAplicacao);

    const pacientes = await this.listPacienteRepository.listPaciente(listPacienteFilters, idAplicacao, idAmbiente);
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
