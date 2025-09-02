import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatusCodeEnum } from "../../../enums/http-status-code-enum.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IListAmbienteController, IListAmbienteRepository, ListAmbienteParams } from "./types.js";

export class ListAmbienteController implements IListAmbienteController {
  constructor(private readonly listAmbienteRepository: IListAmbienteRepository) {}

  async handle(
    request: FastifyRequest<{ Querystring: ListAmbienteParams; Headers: { authorization?: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    const authHeader = request.headers.authorization;
    const filters = request.query;

    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);

    const ambientes = await this.listAmbienteRepository.listAmbiente(filters, idAplicacao);
    const normalizedAmbientes = ambientes.map((ambiente) => {
      return {
        ...ambiente,
        atualizadoEm: ambiente.atualizadoEm.toISOString(),
        criadoEm: ambiente.criadoEm.toISOString(),
      };
    });

    reply.status(HttpStatusCodeEnum.OK).send({
      registros: normalizedAmbientes,
      total: ambientes.length,
      limit: filters.limit,
      offset: filters.offset,
    });
  }
}
