import bcrypt from "bcrypt";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { StatusAplicacaoEnum } from "../../../enums/aplicacao/status-aplicacao-enum";
import { tipoPessoaEnum } from "../../../enums/tipo-pessoa-enum";
import { EmailAlreadyInUseError } from "../../../errors/email-already-in-use-error";
import { InvalidCnpjError } from "../../../errors/invalid-cnpj-error";
import { InvalidCpfError } from "../../../errors/invalid-cpf-error";
import { MongoCreateAplicacaoRepository } from "../../../repositories/aplicacacao/create-aplicacao/mongo-create-aplicacao";
import { MongoGetAplicacaoRepository } from "../../../repositories/aplicacacao/get-aplicacao/mongo-get-aplicacao";
import type { IGetAplicacaoRepository } from "../get-aplicacao/types";
import type { ICreateAplicacaoController, ICreateAplicacaoRepository, TCreateAplicacaoRequest } from "./types";

export class CreateAplicacaoController implements ICreateAplicacaoController {
  constructor(
    private readonly createAplicacaoRepository: ICreateAplicacaoRepository = new MongoCreateAplicacaoRepository(),
    private readonly getAplicacaoRepository: IGetAplicacaoRepository = new MongoGetAplicacaoRepository(),
  ) {}

  async handle(createAplicacaoRequest: TCreateAplicacaoRequest): Promise<string> {
    const { senha, ...aplicacao } = createAplicacaoRequest;

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

    const idAplicacao = await this.createAplicacaoRepository.createAplicacao({
      senha: passwordHash,
      status: StatusAplicacaoEnum.ATIVADO,
      ...aplicacao,
    });
    return idAplicacao;
  }
}
