import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AplicacaoNotFoundError } from "../../../errors/aplicacao-not-found-error.js";
import { EmailAlreadyInUseError } from "../../../errors/email-already-in-use-error.js";
import { UpdateAplicacaoController } from "../../../controllers/aplicacao/update-aplicacao/update-aplicacao.js";

describe("UpdateAplicacaoController", () => {
  let getAplicacaoRepository: any;
  let updateAplicacaoRepository: any;
  let controller: UpdateAplicacaoController;

  const fakeAplicacao = {
    id: "app-123",
    email: "teste@app.com",
    dados: {
      nome: "Aplicacao Original",
      config: { tema: "claro" },
    },
  };

  beforeEach(() => {
    getAplicacaoRepository = {
      getAplicacao: vi.fn(),
      countAplicacoesByEmail: vi.fn(),
    };
    updateAplicacaoRepository = {
      updateAplicacao: vi.fn(),
    };

    controller = new UpdateAplicacaoController(getAplicacaoRepository, updateAplicacaoRepository);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deve lançar AplicacaoNotFoundError se aplicação não existir", async () => {
    getAplicacaoRepository.getAplicacao.mockResolvedValue(null);

    await expect(controller.handle("app-999", { email: "novo@app.com" } as any)).rejects.toBeInstanceOf(
      AplicacaoNotFoundError,
    );
  });

  it("deve lançar EmailAlreadyInUseError se email já estiver em uso", async () => {
    getAplicacaoRepository.getAplicacao.mockResolvedValue({ ...fakeAplicacao });
    getAplicacaoRepository.countAplicacoesByEmail.mockResolvedValue(1);

    await expect(controller.handle("app-123", { email: "jaexiste@app.com" } as any)).rejects.toBeInstanceOf(
      EmailAlreadyInUseError,
    );
  });

  it("deve atualizar email com sucesso se não houver duplicidade", async () => {
    getAplicacaoRepository.getAplicacao.mockResolvedValue({ ...fakeAplicacao });
    getAplicacaoRepository.countAplicacoesByEmail.mockResolvedValue(0);
    updateAplicacaoRepository.updateAplicacao.mockResolvedValue("app-123");

    const result = await controller.handle("app-123", { email: "novo@app.com" } as any);

    expect(result).toBe("app-123");
    expect(updateAplicacaoRepository.updateAplicacao).toHaveBeenCalledWith(
      "app-123",
      expect.objectContaining({ email: "novo@app.com" }),
    );
  });

  it("deve mesclar dados corretamente usando mergeDeep", async () => {
    const aplicacaoMock = {
      ...fakeAplicacao,
      dados: { nome: "Aplicacao Original", config: { tema: "claro", idioma: "pt" } },
    };

    getAplicacaoRepository.getAplicacao.mockResolvedValue(aplicacaoMock);
    getAplicacaoRepository.countAplicacoesByEmail.mockResolvedValue(0);
    updateAplicacaoRepository.updateAplicacao.mockResolvedValue("app-123");

    const updateRequest = {
      dados: { config: { idioma: "en", layout: "compacto" }, descricao: "Nova descrição" },
    };

    const result = await controller.handle("app-123", updateRequest as any);

    expect(result).toBe("app-123");
    expect(updateAplicacaoRepository.updateAplicacao).toHaveBeenCalledWith(
      "app-123",
      expect.objectContaining({
        dados: {
          nome: "Aplicacao Original",
          config: { tema: "claro", idioma: "en", layout: "compacto" },
          descricao: "Nova descrição",
        },
      }),
    );
  });
});
