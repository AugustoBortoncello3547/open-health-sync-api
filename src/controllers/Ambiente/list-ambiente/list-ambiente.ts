import { MongoListAmbienteRepository } from "../../../repositories/ambiente/list-ambiente/mongo-list-ambiente";
import { JwtTokenController } from "../../token/jwt-token-controller";
import type {
  IListAmbienteController,
  IListAmbienteRepository,
  ListAmbienteParams,
  TListAmbienteResponse,
} from "./types";

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
