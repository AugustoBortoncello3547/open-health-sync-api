import { MongoListAmbienteRepository } from "../../../repositories/ambiente/list-ambiente/mongo-list-ambiente.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type {
  IListAmbienteController,
  IListAmbienteRepository,
  ListAmbienteParams,
  TListAmbienteResponse,
} from "./types.js";

export class ListAmbienteController implements IListAmbienteController {
  constructor(private readonly listAmbienteRepository: IListAmbienteRepository = new MongoListAmbienteRepository()) {}

  async handle(listAmbienteFilters: ListAmbienteParams, authHeader?: string): Promise<TListAmbienteResponse> {
    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);

    const ambientes = await this.listAmbienteRepository.listAmbiente(listAmbienteFilters, idAplicacao);
    const normalizedAmbientes = ambientes.map((ambiente) => {
      return {
        ...ambiente,
        atualizadoEm: ambiente.atualizadoEm.toISOString(),
        criadoEm: ambiente.criadoEm.toISOString(),
      };
    });

    return {
      registros: normalizedAmbientes,
      total: ambientes.length,
      limit: listAmbienteFilters.limit,
      offset: listAmbienteFilters.offset,
    };
  }
}
