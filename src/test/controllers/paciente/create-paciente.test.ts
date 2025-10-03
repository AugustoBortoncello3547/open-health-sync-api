import { describe, it, expect, vi, beforeEach } from "vitest";
import { PacienteWithIdExternoAlreadyInUseError } from "../../../errors/paciente-with-Id-externo-already-in-use-error.js";
import { CreatePacienteController } from "../../../controllers/paciente/create-paciente/create-paciente.js";

describe("CreatePacienteController", () => {
  const fakeIdAmbiente = "amb-123";
  const fakeIdAplicacao = "app-123";
  const fakeAuthHeader = "Bearer token-123";
  const fakePacienteRequest = { idExterno: "pac-001", dados: { nome: "João da Silva" } };

  let createPacienteRepository: any;
  let getPacienteRepository: any;
  let getAmbienteController: any;
  let jwtTokenController: any;
  let controller: CreatePacienteController;

  beforeEach(() => {
    createPacienteRepository = { createPaciente: vi.fn() };
    getPacienteRepository = {
      getPaciente: vi.fn(),
      getPacienteOnlyByIdExterno: vi.fn(),
    };
    getAmbienteController = { validateAmbienteIsAvailable: vi.fn() };
    jwtTokenController = { getTokenData: vi.fn() };

    controller = new CreatePacienteController(
      createPacienteRepository,
      getPacienteRepository,
      getAmbienteController,
      jwtTokenController,
    );

    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: fakeIdAplicacao });
  });

  it("deve criar um paciente com sucesso", async () => {
    getPacienteRepository.getPacienteOnlyByIdExterno.mockResolvedValue(null);
    createPacienteRepository.createPaciente.mockResolvedValue("paciente-123");

    const result = await controller.handle(fakeIdAmbiente, fakePacienteRequest, fakeAuthHeader);

    expect(result).toBe("paciente-123");
    expect(jwtTokenController.getTokenData).toHaveBeenCalledWith(fakeAuthHeader);
    expect(getAmbienteController.validateAmbienteIsAvailable).toHaveBeenCalledWith(fakeIdAmbiente, fakeIdAplicacao);
    expect(getPacienteRepository.getPacienteOnlyByIdExterno).toHaveBeenCalledWith(
      fakePacienteRequest.idExterno,
      fakeIdAplicacao,
      fakeIdAmbiente,
    );
    expect(createPacienteRepository.createPaciente).toHaveBeenCalledWith({
      idAmbiente: fakeIdAmbiente,
      idAplicacao: fakeIdAplicacao,
      ...fakePacienteRequest,
    });
    expect(getPacienteRepository.getPaciente).toHaveBeenCalledWith("paciente-123", fakeIdAplicacao, fakeIdAmbiente);
  });

  it("deve lançar erro se o ambiente não estiver disponível", async () => {
    getAmbienteController.validateAmbienteIsAvailable.mockRejectedValue(new Error("Ambiente inválido"));

    await expect(controller.handle(fakeIdAmbiente, fakePacienteRequest, fakeAuthHeader)).rejects.toThrow(
      "Ambiente inválido",
    );
  });

  it("deve lançar erro se já existir paciente com mesmo idExterno", async () => {
    getPacienteRepository.getPacienteOnlyByIdExterno.mockResolvedValue({ id: "paciente-existente" });

    await expect(controller.handle(fakeIdAmbiente, fakePacienteRequest, fakeAuthHeader)).rejects.toBeInstanceOf(
      PacienteWithIdExternoAlreadyInUseError,
    );
  });

  it("deve lançar erro se o repositório falhar ao criar paciente", async () => {
    getPacienteRepository.getPacienteOnlyByIdExterno.mockResolvedValue(null);
    createPacienteRepository.createPaciente.mockRejectedValue(new Error("Falha ao salvar"));

    await expect(controller.handle(fakeIdAmbiente, fakePacienteRequest, fakeAuthHeader)).rejects.toThrow(
      "Falha ao salvar",
    );
  });

  it("deve falhar se o token não retornar idAplicacao", async () => {
    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: "" });
    getAmbienteController.validateAmbienteIsAvailable.mockImplementation(() => {
      throw new Error("Token inválido");
    });

    await expect(controller.handle(fakeIdAmbiente, fakePacienteRequest, fakeAuthHeader)).rejects.toThrow(
      "Token inválido",
    );
  });
});
