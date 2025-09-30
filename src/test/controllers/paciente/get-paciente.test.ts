import { describe, it, expect, vi, beforeEach } from "vitest";
import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";
import { GetPacienteController } from "../../../controllers/paciente/get-paciente/get-paciente.js";

describe("GetPacienteController", () => {
  const fakeIdAmbiente = "amb-123";
  const fakeIdAplicacao = "app-123";
  const fakeAuthHeader = "Bearer token-123";

  const now = new Date();
  const fakePaciente = {
    id: "pac-001",
    dados: { nome: "Carlos Silva" },
    atualizadoEm: now,
    criadoEm: now,
  };

  let getPacienteRepository: any;
  let getAmbienteController: any;
  let jwtTokenController: any;
  let controller: GetPacienteController;

  beforeEach(() => {
    getPacienteRepository = { getPaciente: vi.fn() };
    getAmbienteController = { validateAmbienteIsAvailable: vi.fn() };
    jwtTokenController = { getTokenData: vi.fn() };

    controller = new GetPacienteController(getPacienteRepository, getAmbienteController, jwtTokenController);

    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: fakeIdAplicacao });
  });

  it("deve retornar paciente com datas em formato ISO", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue(fakePaciente);

    const result = await controller.handle(fakeIdAmbiente, fakePaciente.id, fakeAuthHeader);

    expect(result).toEqual({
      ...fakePaciente,
      atualizadoEm: now.toISOString(),
      criadoEm: now.toISOString(),
    });

    expect(jwtTokenController.getTokenData).toHaveBeenCalledWith(fakeAuthHeader);
    expect(getAmbienteController.validateAmbienteIsAvailable).toHaveBeenCalledWith(fakeIdAmbiente, fakeIdAplicacao);
    expect(getPacienteRepository.getPaciente).toHaveBeenCalledWith(fakePaciente.id, fakeIdAplicacao, fakeIdAmbiente);
  });

  it("deve lançar erro se o ambiente não estiver disponível", async () => {
    getAmbienteController.validateAmbienteIsAvailable.mockRejectedValue(new Error("Ambiente inválido"));

    await expect(controller.handle(fakeIdAmbiente, fakePaciente.id, fakeAuthHeader)).rejects.toThrow(
      "Ambiente inválido",
    );
  });

  it("deve lançar PacienteNotFoundError se paciente não existir", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue(null);

    await expect(controller.handle(fakeIdAmbiente, fakePaciente.id, fakeAuthHeader)).rejects.toBeInstanceOf(
      PacienteNotFoundError,
    );
  });

  it("deve falhar se o token não retornar idAplicacao", async () => {
    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: "" });
    getAmbienteController.validateAmbienteIsAvailable.mockImplementation(() => {
      throw new Error("Token inválido");
    });

    await expect(controller.handle(fakeIdAmbiente, fakePaciente.id, fakeAuthHeader)).rejects.toThrow("Token inválido");
  });

  it("deve lançar erro se o repositório falhar", async () => {
    getPacienteRepository.getPaciente.mockRejectedValue(new Error("Falha no banco"));

    await expect(controller.handle(fakeIdAmbiente, fakePaciente.id, fakeAuthHeader)).rejects.toThrow("Falha no banco");
  });
});
