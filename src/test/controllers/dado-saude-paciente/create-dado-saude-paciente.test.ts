import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateDadoSaudePacienteController } from "../../../controllers/dado-saude-paciente/create-dado-saude-paciente/create-dado-saude-paciente.js";
import { DadoSaudePacienteWithIdExternoAlreadyInUseError } from "../../../errors/dado-saude-paciente-with-Id-externo-already-in-use-error.js";
import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";

describe("CreateDadoSaudePacienteController", () => {
  const fakeIdPaciente = "pac-123";
  const fakeIdAplicacao = "app-123";
  const fakeAuthHeader = "Bearer token-xyz";
  const fakeDadoSaudeRequest = { idExterno: "ds-001", dados: { tipo: "pressao", valor: "120/80" } };

  let createDadoSaudePacienteRepository: any;
  let getDadoSaudePacienteRepository: any;
  let getPacienteRepository: any;
  let jwtTokenController: any;
  let controller: CreateDadoSaudePacienteController;

  beforeEach(() => {
    createDadoSaudePacienteRepository = { createDadoSaudePaciente: vi.fn() };
    getDadoSaudePacienteRepository = {
      getDadoSaudePaciente: vi.fn(),
      getDadoSaudePacienteOnlyByIdExterno: vi.fn(),
    };
    getPacienteRepository = { getPaciente: vi.fn() };
    jwtTokenController = { getTokenData: vi.fn() };

    controller = new CreateDadoSaudePacienteController(
      createDadoSaudePacienteRepository,
      getDadoSaudePacienteRepository,
      getPacienteRepository,
      jwtTokenController,
    );

    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: fakeIdAplicacao });
  });

  it("deve criar um dado de saúde do paciente com sucesso", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue({ id: fakeIdPaciente });
    getDadoSaudePacienteRepository.getDadoSaudePacienteOnlyByIdExterno.mockResolvedValue(null);
    createDadoSaudePacienteRepository.createDadoSaudePaciente.mockResolvedValue("ds-123");

    const result = await controller.handle(fakeIdPaciente, fakeDadoSaudeRequest, fakeAuthHeader);

    expect(result).toBe("ds-123");
    expect(jwtTokenController.getTokenData).toHaveBeenCalledWith(fakeAuthHeader);
    expect(getPacienteRepository.getPaciente).toHaveBeenCalledWith(fakeIdPaciente, fakeIdAplicacao, undefined);
    expect(getDadoSaudePacienteRepository.getDadoSaudePacienteOnlyByIdExterno).toHaveBeenCalledWith(
      fakeDadoSaudeRequest.idExterno,
      fakeIdAplicacao,
      fakeIdPaciente,
    );
    expect(createDadoSaudePacienteRepository.createDadoSaudePaciente).toHaveBeenCalledWith({
      idPaciente: fakeIdPaciente,
      idAplicacao: fakeIdAplicacao,
      ...fakeDadoSaudeRequest,
    });
    expect(getDadoSaudePacienteRepository.getDadoSaudePaciente).toHaveBeenCalledWith(
      "ds-123",
      fakeIdAplicacao,
      fakeIdPaciente,
    );
  });

  it("deve lançar erro se o paciente não for encontrado", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue(null);

    await expect(controller.handle(fakeIdPaciente, fakeDadoSaudeRequest, fakeAuthHeader)).rejects.toBeInstanceOf(
      PacienteNotFoundError,
    );
  });

  it("deve lançar erro se já existir dado de saúde com o mesmo idExterno", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue({ id: fakeIdPaciente });
    getDadoSaudePacienteRepository.getDadoSaudePacienteOnlyByIdExterno.mockResolvedValue({ id: "ds-existente" });

    await expect(controller.handle(fakeIdPaciente, fakeDadoSaudeRequest, fakeAuthHeader)).rejects.toBeInstanceOf(
      DadoSaudePacienteWithIdExternoAlreadyInUseError,
    );
  });

  it("deve lançar erro se o repositório falhar ao criar dado de saúde", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue({ id: fakeIdPaciente });
    getDadoSaudePacienteRepository.getDadoSaudePacienteOnlyByIdExterno.mockResolvedValue(null);
    createDadoSaudePacienteRepository.createDadoSaudePaciente.mockRejectedValue(new Error("Falha ao salvar dado"));

    await expect(controller.handle(fakeIdPaciente, fakeDadoSaudeRequest, fakeAuthHeader)).rejects.toThrow(
      "Falha ao salvar dado",
    );
  });

  it("deve falhar se o token não retornar idAplicacao", async () => {
    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: "" });
    getPacienteRepository.getPaciente.mockImplementation(() => {
      throw new Error("Token inválido");
    });

    await expect(controller.handle(fakeIdPaciente, fakeDadoSaudeRequest, fakeAuthHeader)).rejects.toThrow(
      "Token inválido",
    );
  });
});
