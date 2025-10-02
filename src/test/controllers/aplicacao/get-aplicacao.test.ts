import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AplicacaoNotFoundError } from "../../../errors/aplicacao-not-found-error.js";
import { GetAplicacaoController } from "../../../controllers/aplicacao/get-aplicacao/get-aplicacao.js";

describe("GetAplicacaoController", () => {
  let getAplicacaoRepository: any;
  let controller: GetAplicacaoController;

  const fakeAplicacao = {
    id: "app-123",
    email: "teste@app.com",
    status: "ATIVO",
    criadoEm: new Date("2024-01-01T10:00:00.000Z"),
    atualizadoEm: new Date("2024-01-02T12:00:00.000Z"),
  };

  beforeEach(() => {
    getAplicacaoRepository = {
      getAplicacao: vi.fn(),
    };

    controller = new GetAplicacaoController(getAplicacaoRepository);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deve retornar aplicação formatada com sucesso", async () => {
    getAplicacaoRepository.getAplicacao.mockResolvedValue(fakeAplicacao);

    const result = await controller.handle("app-123");

    expect(result).toEqual({
      ...fakeAplicacao,
      criadoEm: "2024-01-01T10:00:00.000Z",
      atualizadoEm: "2024-01-02T12:00:00.000Z",
    });
    expect(getAplicacaoRepository.getAplicacao).toHaveBeenCalledWith("app-123");
  });

  it("deve lançar AplicacaoNotFoundError se aplicação não for encontrada", async () => {
    getAplicacaoRepository.getAplicacao.mockResolvedValue(null);

    await expect(controller.handle("app-999")).rejects.toBeInstanceOf(AplicacaoNotFoundError);
  });
});
