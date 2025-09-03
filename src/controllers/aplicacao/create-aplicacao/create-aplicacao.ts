import bcrypt from "bcrypt";
import { cnpj, cpf } from "cpf-cnpj-validator";
import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusAplicacaoEnum } from "../../../enums/aplicacao/status-aplicacao-enum.js";
import { HttpStatusCodeEnum } from "../../../enums/http-status-code-enum.js";
import { tipoPessoaEnum } from "../../../enums/tipo-pessoa-enum.js";
import { EmailAlreadyInUseError } from "../../../errors/email-already-in-use-error.js";
import { InvalidCnpjError } from "../../../errors/invalid-cnpj-error.js";
import { InvalidCpfError } from "../../../errors/invalid-cpf-error.js";
import { MongoCreateAplicacaoRepository } from "../../../repositories/aplicacacao/create-aplicacao/mongo-create-aplicacao.js";
import { MongoGetAplicacaoRepository } from "../../../repositories/aplicacacao/get-aplicacao/mongo-get-aplicacao.js";
import type { IGetAplicacaoRepository } from "../get-aplicacao/types.js";
import type { ICreateAplicacaoController, ICreateAplicacaoRepository, TCreateAplicacaoParams } from "./types.js";

export class CreateAplicacaoController implements ICreateAplicacaoController {
  constructor(
    private readonly createAplicacaoRepository: ICreateAplicacaoRepository = new MongoCreateAplicacaoRepository(),
    private readonly getAplicacaoRepository: IGetAplicacaoRepository = new MongoGetAplicacaoRepository(),
  ) {}

  async handle(request: FastifyRequest<{ Body: TCreateAplicacaoParams }>, reply: FastifyReply): Promise<void> {
    const { senha, ...aplicacao } = request.body;

    if (aplicacao.dados.tipoPessoa === tipoPessoaEnum.FISICA && !cpf.isValid(aplicacao.dados.cpfCnpj)) {
      throw new InvalidCpfError();
    }

    if (aplicacao.dados.tipoPessoa === tipoPessoaEnum.JURIDICA && !cnpj.isValid(aplicacao.dados.cpfCnpj)) {
      throw new InvalidCnpjError();
    }

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
    reply.status(HttpStatusCodeEnum.CREATED).send({ id });
  }
}
