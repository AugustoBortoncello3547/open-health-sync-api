import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateAmbienteController } from "../../../controllers/ambiente/create-ambiente/create-ambiente.js";
import { StatusAmbienteEnum } from "../../../enums/ambiente/status-ambiente-enum.js";
import { AmbienteWithIdExternoAlreadyInUseError } from "../../../errors/ambiente-with-idexterno-already-in-use-error.js";

describe("CreateAmbienteController", () => {
  const fakeIdAplicacao = "app-123";
  const fakeAuthHeader = "Bearer token-123";

  const fakeCreateAmbienteRequest = {
    idExterno: "ext-001",
    nome: "Ambiente Teste",
    urlWebhook: "http://localhost/webhook",
    tokenWebhook: "token-xyz",
  };

  let createAmbienteRepository: any;
  let getAmbienteRepository: any;
  let jwtTokenController: any;
  let controller: CreateAmbienteController;

  beforeEach(() => {
    createAmbienteRepository = { createAmbiente: vi.fn() };
    getAmbienteRepository = { getAmbienteOnlyByIdExterno: vi.fn() };
    jwtTokenController = { getTokenData: vi.fn() };

    controller = new CreateAmbienteController(createAmbienteRepository, getAmbienteRepository, jwtTokenController);

    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: fakeIdAplicacao });
  });

  it("deve criar ambiente com sucesso e retornar id", async () => {
    getAmbienteRepository.getAmbienteOnlyByIdExterno.mockResolvedValue(null);
    createAmbienteRepository.createAmbiente.mockResolvedValue("amb-001");

    // Espionamos o generateAmbienteApiKey para garantir previsibilidade
    const spyApiKey = vi.spyOn(controller, "generateAmbienteApiKey").mockResolvedValue("amb_apiKey_fake");

    const result = await controller.handle(fakeCreateAmbienteRequest, fakeAuthHeader);

    expect(result).toBe("amb-001");

    expect(jwtTokenController.getTokenData).toHaveBeenCalledWith(fakeAuthHeader);
    expect(getAmbienteRepository.getAmbienteOnlyByIdExterno).toHaveBeenCalledWith(
      fakeCreateAmbienteRequest.idExterno,
      fakeIdAplicacao,
    );
    expect(createAmbienteRepository.createAmbiente).toHaveBeenCalledWith({
      ...fakeCreateAmbienteRequest,
      idAplicacao: fakeIdAplicacao,
      status: StatusAmbienteEnum.ATIVO,
      apiKey: "amb_apiKey_fake",
    });

    spyApiKey.mockRestore();
  });

  it("deve lançar erro se já existir ambiente com mesmo idExterno", async () => {
    getAmbienteRepository.getAmbienteOnlyByIdExterno.mockResolvedValue({ id: "amb-xyz" });

    await expect(controller.handle(fakeCreateAmbienteRequest, fakeAuthHeader)).rejects.toBeInstanceOf(
      AmbienteWithIdExternoAlreadyInUseError,
    );
  });

  it("deve lançar erro se repositório falhar ao criar", async () => {
    getAmbienteRepository.getAmbienteOnlyByIdExterno.mockResolvedValue(null);
    createAmbienteRepository.createAmbiente.mockRejectedValue(new Error("Falha no banco"));

    await expect(controller.handle(fakeCreateAmbienteRequest, fakeAuthHeader)).rejects.toThrow("Falha no banco");
  });

  it("deve gerar apiKey com prefixo amb_", async () => {
    const apiKey = await controller.generateAmbienteApiKey();
    expect(apiKey).toMatch(/^amb_[a-f0-9]{48}$/); // 24 bytes em hex → 48 chars
  });
});
