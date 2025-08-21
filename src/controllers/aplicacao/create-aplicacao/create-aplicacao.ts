import bcrypt from "bcrypt";
import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusAplicacaoEnum } from "../../../enums/aplicacao/status-aplicacao-enum.js";
import { HttpStatusCode } from "../../../enums/http-status-code-enum.js";
import type { ICreateAplicaoController, ICreateAplicaoRepository, TCreateAplicacaoParams } from "./types.js";

export class CreateAplicacaoController implements ICreateAplicaoController {
  constructor(private readonly createAplicaoRepository: ICreateAplicaoRepository) {}

  async handle(request: FastifyRequest<{ Body: TCreateAplicacaoParams }>, reply: FastifyReply): Promise<void> {
    const { senha, ...aplicacao } = request.body;

    const saltRounds = Number(process.env.SALT_PASSWORD_HASH);
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(senha, salt);

    const id = await this.createAplicaoRepository.createAplicacao({
      senha: passwordHash,
      status: StatusAplicacaoEnum.Ativado,
      ...aplicacao,
    });
    reply.status(HttpStatusCode.CREATED).send({ id });
  }
}
