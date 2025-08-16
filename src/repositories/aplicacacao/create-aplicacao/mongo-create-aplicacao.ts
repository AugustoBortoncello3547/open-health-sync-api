import type {
  CreateAplicacaoParams,
  ICreateAplicaoRepository,
} from "../../../controllers/aplicacao/create-aplicacao/types.js";

export class MongoCreateAplicacaoRepository implements ICreateAplicaoRepository {
  async createAplicacao(params: CreateAplicacaoParams): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
