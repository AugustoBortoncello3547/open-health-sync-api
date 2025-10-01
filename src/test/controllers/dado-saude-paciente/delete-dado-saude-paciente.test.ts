import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteDadoSaudePacienteController } from "../../../controllers/dado-saude-paciente/delete-dado-saude-paciente/delete-dado-saude-paciente.js";
import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";
import { DadoSaudePacienteNotFoundError } from "../../../errors/dado-saude-paciente-not-found-error.js";

describe("DeleteDadoSaudePacienteController", () => {
  const fakeIdPaciente = "pac-123";
  const fakeIdAplicacao = "app-123";
  const fakeAuthHeader = "Bearer token-xyz";
  const fakeRegistro = { id: "ds-001", dados: { tipo: "pressao", valor: "120/80" } };

  let getDadoSaudePacienteRepository: any;
  let deleteDadoSaudePacienteRepository: any;
  let getPacienteRepository: any;
  let jwtTokenController: any;
  let controller: DeleteDadoSaudePacienteController;

  beforeEach(() => {
    getDadoSaudePacienteRepository = { getDadoSaudePaciente: vi.fn() };
    deleteDadoSaudePacienteRepository = { deleteDadoSaudePaciente: vi.fn() };
    getPacienteRepository = { getPaciente: vi.fn() };
    jwtTokenController = { getTokenData: vi.fn() };

    controller = new DeleteDadoSaudePacienteController(
      getDadoSaudePacienteRepository,
      deleteDadoSaudePacienteRepository,
      getPacienteRepository,
      jwtTokenController,
    );

    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: fakeIdAplicacao });
  });

  it("deve deletar um dado de saúde do paciente com sucesso", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue({ id: fakeIdPaciente });
    getDadoSaudePacienteRepository.getDadoSaudePaciente.mockResolvedValue(fakeRegistro);
    deleteDadoSaudePacienteRepository.deleteDadoSaudePaciente.mockResolvedValue(undefined);

    await controller.handle(fakeRegistro.id, fakeIdPaciente, fakeAuthHeader);

    expect(jwtTokenController.getTokenData).toHaveBeenCalledWith(fakeAuthHeader);
    expect(getPacienteRepository.getPaciente).toHaveBeenCalledWith(fakeIdPaciente, fakeIdAplicacao, undefined);
    expect(getDadoSaudePacienteRepository.getDadoSaudePaciente).toHaveBeenCalledWith(
      fakeRegistro.id,
      fakeIdAplicacao,
      fakeIdPaciente,
    );
    expect(deleteDadoSaudePacienteRepository.deleteDadoSaudePaciente).toHaveBeenCalledWith(
      fakeRegistro.id,
      fakeIdAplicacao,
    );
  });

  it("deve lançar PacienteNotFoundError se o paciente não existir", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue(null);

    await expect(controller.handle(fakeRegistro.id, fakeIdPaciente, fakeAuthHeader)).rejects.toBeInstanceOf(
      PacienteNotFoundError,
    );
  });

  it("deve lançar DadoSaudePacienteNotFoundError se o registro não existir", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue({ id: fakeIdPaciente });
    getDadoSaudePacienteRepository.getDadoSaudePaciente.mockResolvedValue(null);

    await expect(controller.handle(fakeRegistro.id, fakeIdPaciente, fakeAuthHeader)).rejects.toBeInstanceOf(
      DadoSaudePacienteNotFoundError,
    );
  });

  it("deve lançar erro se deleteDadoSaudePacienteRepository falhar", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue({ id: fakeIdPaciente });
    getDadoSaudePacienteRepository.getDadoSaudePaciente.mockResolvedValue(fakeRegistro);
    deleteDadoSaudePacienteRepository.deleteDadoSaudePaciente.mockRejectedValue(new Error("Erro ao excluir"));

    await expect(controller.handle(fakeRegistro.id, fakeIdPaciente, fakeAuthHeader)).rejects.toThrow("Erro ao excluir");
  });

  it("deve falhar se o token não retornar idAplicacao", async () => {
    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: "" });
    getPacienteRepository.getPaciente.mockImplementation(() => {
      throw new Error("Token inválido");
    });

    await expect(controller.handle(fakeRegistro.id, fakeIdPaciente, fakeAuthHeader)).rejects.toThrow("Token inválido");
  });
});
