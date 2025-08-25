import bcrypt from "bcrypt";
import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusAplicacaoEnum } from "../../../enums/aplicacao/status-aplicacao-enum.js";
import { HttpStatusCode } from "../../../enums/http-status-code-enum.js";
import type { ICreateAplicacaoController, ICreateAplicacaoRepository, TCreateAplicacaoParams } from "./types.js";
import type { IGetAplicacaoRepository } from "../get-aplicacao/types.js";
import { EmailAlreadyInUseError } from "../../../errors/email-already-in-use-error.js";

export class CreateAplicacaoController implements ICreateAplicacaoController {
  constructor(
    private readonly createAplicacaoRepository: ICreateAplicacaoRepository,
    private readonly getAplicacaoRepository: IGetAplicacaoRepository,
  ) {}

  async handle(request: FastifyRequest<{ Body: TCreateAplicacaoParams }>, reply: FastifyReply): Promise<void> {
    const { senha, ...aplicacao } = request.body;

    const aplicacaoDB = await this.getAplicacaoRepository.getAplicacaoByEmail(aplicacao.email);
    if (aplicacaoDB) {
      throw new EmailAlreadyInUseError();
    }

    const saltRounds = Number(process.env.SALT_PASSWORD_HASH);
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(senha, salt);

    const id = await this.createAplicacaoRepository.createAplicacao({
      senha: passwordHash,
      status: StatusAplicacaoEnum.ATIVADO,
      ...aplicacao,
    });
    reply.status(HttpStatusCode.CREATED).send({ id });
  }
}
