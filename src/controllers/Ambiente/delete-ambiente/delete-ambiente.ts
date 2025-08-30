import type { FastifyReply, FastifyRequest } from "fastify";
import type { DeleteAmbienteParams, IDeleteAmbienteController, IDeleteAmbienteRepository } from "./types.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import { HttpStatusCode } from "../../../enums/http-status-code-enum.js";
import type { IGetAmbienteRepository } from "../get-ambiente/types.js";
import { AmbienteNotFoundError } from "../../../errors/ambiente-not-found-error.js";

export class DeleteAmbienteController implements IDeleteAmbienteController {
  constructor(
    private readonly getAmbienteRepository: IGetAmbienteRepository,
    private readonly deleteAmbienteRepository: IDeleteAmbienteRepository,
  ) {}

  async handle(
    request: FastifyRequest<{ Params: DeleteAmbienteParams; Headers: { authorization?: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    const authHeader = request.headers.authorization;
    const { idAmbiente } = request.params;

    const jwtTokenController = new JwtTokenController();
    const { idAplicacao } = await jwtTokenController.getTokenData(authHeader);

    const ambiente = await this.getAmbienteRepository.getAmbiente(idAmbiente, idAplicacao);
    if (!ambiente) {
      throw new AmbienteNotFoundError();
    }

    // TODO: validar se não tem pacientes no ambiente

    await this.deleteAmbienteRepository.deleteAmbiente(ambiente.id, idAplicacao);
    reply.status(HttpStatusCode.NO_CONTENT);
  }
}
