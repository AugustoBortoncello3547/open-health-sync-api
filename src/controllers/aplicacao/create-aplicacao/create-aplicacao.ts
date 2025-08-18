import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateAplicacaoParams, ICreateAplicaoController, ICreateAplicaoRepository } from "./types.js";
import { HttpStatusCode } from "../../../enums/http-status-code-enum.js";
import bcrypt from "bcrypt";

export class CreateAplicacaoController implements ICreateAplicaoController {
  constructor(private readonly createAplicaoRepository: ICreateAplicaoRepository) {}

  async handle(request: FastifyRequest<{ Body: CreateAplicacaoParams }>, reply: FastifyReply): Promise<void> {
    const { senha, ...aplicacao } = request.body;

    const saltRounds = Number(process.env.SALT_PASSWORD_HASH);
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(senha, salt);

    const id = await this.createAplicaoRepository.createAplicacao({
      senha: passwordHash,
      ...aplicacao,
    });
    reply.status(HttpStatusCode.CREATED).send({ id });
  }
}
