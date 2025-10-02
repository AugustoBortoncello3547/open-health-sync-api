import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import bcrypt from "bcrypt";
import { cpf, cnpj } from "cpf-cnpj-validator";
import { InvalidCpfError } from "../../../errors/invalid-cpf-error.js";
import { InvalidCnpjError } from "../../../errors/invalid-cnpj-error.js";
import { EmailAlreadyInUseError } from "../../../errors/email-already-in-use-error.js";
import { StatusAplicacaoEnum } from "../../../enums/aplicacao/status-aplicacao-enum.js";
import { TipoPessoaEnum } from "../../../enums/tipo-pessoa-enum.js";
import { CreateAplicacaoController } from "../../../controllers/aplicacao/create-aplicacao/create-aplicacao.js";

vi.mock("bcrypt", () => {
  return {
    default: {
      genSaltSync: vi.fn(),
      hashSync: vi.fn(),
    },
    genSaltSync: vi.fn(),
    hashSync: vi.fn(),
  };
});

vi.mock("cpf-cnpj-validator", () => ({
  cpf: { isValid: vi.fn() },
  cnpj: { isValid: vi.fn() },
}));

describe("CreateAplicacaoController", () => {
  let createAplicacaoRepository: any;
  let getAplicacaoRepository: any;
  let controller: CreateAplicacaoController;

  const fakeRequest = {
    email: "teste@app.com",
    senha: "senha123",
    dados: {
      tipoPessoa: TipoPessoaEnum.FISICA,
      cpfCnpj: "12345678900",
    },
  };

  beforeEach(() => {
    createAplicacaoRepository = {
      createAplicacao: vi.fn(),
    };
    getAplicacaoRepository = {
      getAplicacaoByEmail: vi.fn(),
    };

    controller = new CreateAplicacaoController(createAplicacaoRepository, getAplicacaoRepository);

    process.env.SALT_PASSWORD_HASH = 10;

    (bcrypt.genSaltSync as any).mockReturnValue("fake-salt");
    (bcrypt.hashSync as any).mockReturnValue("hashed-password");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deve lançar erro se CPF for inválido", async () => {
    (cpf.isValid as any).mockReturnValue(false);

    await expect(controller.handle(fakeRequest as any)).rejects.toBeInstanceOf(InvalidCpfError);
  });

  it("deve lançar erro se CNPJ for inválido", async () => {
    const request = {
      ...fakeRequest,
      dados: { tipoPessoa: TipoPessoaEnum.JURIDICA, cpfCnpj: "11222333000181" },
    };
    (cnpj.isValid as any).mockReturnValue(false);

    await expect(controller.handle(request as any)).rejects.toBeInstanceOf(InvalidCnpjError);
  });

  it("deve lançar erro se email já estiver em uso", async () => {
    (cpf.isValid as any).mockReturnValue(true);
    getAplicacaoRepository.getAplicacaoByEmail.mockResolvedValue({ id: "existente" });

    await expect(controller.handle(fakeRequest as any)).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });

  it("deve criar aplicação com sucesso", async () => {
    (cpf.isValid as any).mockReturnValue(true);
    getAplicacaoRepository.getAplicacaoByEmail.mockResolvedValue(null);
    createAplicacaoRepository.createAplicacao.mockResolvedValue("new-app-id");

    const result = await controller.handle(fakeRequest as any);

    expect(result).toBe("new-app-id");
    expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
    expect(bcrypt.hashSync).toHaveBeenCalledWith("senha123", "fake-salt");
    expect(createAplicacaoRepository.createAplicacao).toHaveBeenCalledWith(
      expect.objectContaining({
        email: fakeRequest.email,
        senha: "hashed-password",
        status: StatusAplicacaoEnum.ATIVADO,
      }),
    );
  });
});
