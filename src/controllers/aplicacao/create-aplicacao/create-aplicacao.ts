import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateAplicacaoParams, ICreateAplicaoController, ICreateAplicaoRepository } from "./types.js";
import { HttpStatusCode } from "../../../enums/http-status-code-enum.js";

export class CreateAplicacaoController implements ICreateAplicaoController {
  constructor(private readonly createAplicaoRepository: ICreateAplicaoRepository) {}

  async handle(request: FastifyRequest<{ Body: CreateAplicacaoParams }>, reply: FastifyReply): Promise<void> {
    try {
      const id = await this.createAplicaoRepository.createAplicacao(request.body);
      reply.status(HttpStatusCode.CREATED).send({ id });
    } catch (error) {
      reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: "Erro Interno no servidor" });
    }
  }
}
