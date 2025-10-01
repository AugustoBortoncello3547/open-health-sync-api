import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListAmbienteController } from "../../../controllers/ambiente/list-ambiente/list-ambiente.js";

describe("ListAmbienteController", () => {
  const fakeIdAplicacao = "app-123";
  const fakeAuthHeader = "Bearer token-123";

  const now = new Date();
  const fakeAmbientes = [
    {
      id: "amb-001",
      idExterno: "ext-001",
      nome: "Ambiente 1",
      status: "ATIVO",
      apiKey: "api-key-001",
      urlWebhook: "http://webhook1.com",
      tokenWebhook: "token1",
      criadoEm: now,
      atualizadoEm: now,
      idAplicacao: fakeIdAplicacao,
    },
    {
      id: "amb-002",
      idExterno: "ext-002",
      nome: "Ambiente 2",
      status: "ATIVO",
      apiKey: "api-key-002",
      urlWebhook: "http://webhook2.com",
      tokenWebhook: "token2",
      criadoEm: now,
      atualizadoEm: now,
      idAplicacao: fakeIdAplicacao,
    },
  ];

  let listAmbienteRepository: any;
  let jwtTokenController: any;
  let controller: ListAmbienteController;

  beforeEach(() => {
    listAmbienteRepository = { listAmbiente: vi.fn() };
    jwtTokenController = { getTokenData: vi.fn() };

    controller = new ListAmbienteController(listAmbienteRepository, jwtTokenController);

    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: fakeIdAplicacao });
  });

  it("deve listar ambientes com sucesso", async () => {
    listAmbienteRepository.listAmbiente.mockResolvedValue(fakeAmbientes);

    const result = await controller.handle({ limit: 10, offset: 0, nome: "Teste", status: "Teste" }, fakeAuthHeader);

    expect(result).toEqual({
      registros: fakeAmbientes.map((a) => ({
        ...a,
        criadoEm: now.toISOString(),
        atualizadoEm: now.toISOString(),
      })),
      total: fakeAmbientes.length,
      limit: 10,
      offset: 0,
    });

    expect(jwtTokenController.getTokenData).toHaveBeenCalledWith(fakeAuthHeader);
    expect(listAmbienteRepository.listAmbiente).toHaveBeenCalledWith(
      { limit: 10, offset: 0, nome: "Teste", status: "Teste" },
      fakeIdAplicacao,
    );
  });

  it("deve retornar lista vazia corretamente", async () => {
    listAmbienteRepository.listAmbiente.mockResolvedValue([]);

    const result = await controller.handle({ limit: 10, offset: 0, nome: "Teste", status: "Teste" }, fakeAuthHeader);

    expect(result).toEqual({
      registros: [],
      total: 0,
      limit: 10,
      offset: 0,
    });
  });

  it("deve lançar erro se o token não retornar idAplicacao", async () => {
    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: "" });

    await expect(
      controller.handle({ limit: 10, offset: 0, nome: "Teste", status: "Teste" }, fakeAuthHeader),
    ).rejects.toThrowError();
  });

  it("deve lançar erro se o repositório falhar", async () => {
    listAmbienteRepository.listAmbiente.mockRejectedValue(new Error("Falha no banco"));

    await expect(
      controller.handle({ limit: 10, offset: 0, nome: "Teste", status: "Teste" }, fakeAuthHeader),
    ).rejects.toThrow("Falha no banco");
  });
});
