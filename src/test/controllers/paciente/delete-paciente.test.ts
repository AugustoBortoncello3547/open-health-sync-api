import { describe, it, expect, vi, beforeEach } from "vitest";
import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";
import { DeletePacienteController } from "../../../controllers/paciente/delete-paciente.ts/delete-paciente.js";

describe("DeletePacienteController", () => {
  const fakeIdAmbiente = "amb-123";
  const fakeIdAplicacao = "app-123";
  const fakeAuthHeader = "Bearer token-123";
  const fakePaciente = { id: "pac-001", dados: { nome: "Maria Souza" } };

  let getPacienteRepository: any;
  let deletePacienteRepository: any;
  let getAmbienteController: any;
  let jwtTokenController: any;
  let controller: DeletePacienteController;

  beforeEach(() => {
    getPacienteRepository = { getPaciente: vi.fn() };
    deletePacienteRepository = { deletePaciente: vi.fn() };
    getAmbienteController = { validateAmbienteIsAvailable: vi.fn() };
    jwtTokenController = { getTokenData: vi.fn() };

    controller = new DeletePacienteController(
      getPacienteRepository,
      deletePacienteRepository,
      getAmbienteController,
      jwtTokenController,
    );

    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: fakeIdAplicacao });
  });

  it("deve deletar um paciente com sucesso", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue(fakePaciente);
    deletePacienteRepository.deletePaciente.mockResolvedValue(undefined);

    await controller.handle(fakeIdAmbiente, fakePaciente.id, fakeAuthHeader);

    expect(jwtTokenController.getTokenData).toHaveBeenCalledWith(fakeAuthHeader);
    expect(getAmbienteController.validateAmbienteIsAvailable).toHaveBeenCalledWith(fakeIdAmbiente, fakeIdAplicacao);
    expect(getPacienteRepository.getPaciente).toHaveBeenCalledWith(fakePaciente.id, fakeIdAplicacao, fakeIdAmbiente);
    expect(deletePacienteRepository.deletePaciente).toHaveBeenCalledWith(fakePaciente.id, fakeIdAplicacao);
  });

  it("deve lançar erro se o ambiente não estiver disponível", async () => {
    getAmbienteController.validateAmbienteIsAvailable.mockRejectedValue(new Error("Ambiente inválido"));

    await expect(controller.handle(fakeIdAmbiente, fakePaciente.id, fakeAuthHeader)).rejects.toThrow(
      "Ambiente inválido",
    );
  });

  it("deve lançar PacienteNotFoundError se o paciente não existir", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue(null);

    await expect(controller.handle(fakeIdAmbiente, fakePaciente.id, fakeAuthHeader)).rejects.toBeInstanceOf(
      PacienteNotFoundError,
    );
  });

  it("deve lançar erro se deletePacienteRepository falhar", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue(fakePaciente);
    deletePacienteRepository.deletePaciente.mockRejectedValue(new Error("Falha no banco"));

    await expect(controller.handle(fakeIdAmbiente, fakePaciente.id, fakeAuthHeader)).rejects.toThrow("Falha no banco");
  });

  it("deve falhar se o token não retornar idAplicacao", async () => {
    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: "" });
    getAmbienteController.validateAmbienteIsAvailable.mockImplementation(() => {
      throw new Error("Token inválido");
    });

    await expect(controller.handle(fakeIdAmbiente, fakePaciente.id, fakeAuthHeader)).rejects.toThrow("Token inválido");
  });
});
