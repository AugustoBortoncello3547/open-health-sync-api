import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetDadoSaudePacienteController } from "../../../controllers/dado-saude-paciente/get-dado-saude-paciente/get-dado-saude-paciente.js";
import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";
import { DadoSaudePacienteNotFoundError } from "../../../errors/dado-saude-paciente-not-found-error.js";

describe("GetDadoSaudePacienteController", () => {
  const fakeIdPaciente = "pac-123";
  const fakeIdAplicacao = "app-123";
  const fakeAuthHeader = "Bearer token-xyz";
  const fakeIdRegistro = "ds-001";

  const now = new Date();
  const fakeRegistro = {
    id: fakeIdRegistro,
    idExterno: "ds-ex-001",
    dados: { tipo: "pressao", valor: "120/80" },
    atualizadoEm: now,
    criadoEm: now,
  };

  let getDadoSaudePacienteRepository: any;
  let getPacienteRepository: any;
  let jwtTokenController: any;
  let controller: GetDadoSaudePacienteController;

  beforeEach(() => {
    getDadoSaudePacienteRepository = { getDadoSaudePaciente: vi.fn() };
    getPacienteRepository = { getPaciente: vi.fn() };
    jwtTokenController = { getTokenData: vi.fn() };

    controller = new GetDadoSaudePacienteController(
      getDadoSaudePacienteRepository,
      getPacienteRepository,
      jwtTokenController,
    );

    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: fakeIdAplicacao });
  });

  it("deve retornar dado de saúde do paciente com datas em formato ISO", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue({ id: fakeIdPaciente });
    getDadoSaudePacienteRepository.getDadoSaudePaciente.mockResolvedValue(fakeRegistro);

    const result = await controller.handle(fakeIdRegistro, fakeIdPaciente, fakeAuthHeader);

    expect(result).toEqual({
      ...fakeRegistro,
      atualizadoEm: now.toISOString(),
      criadoEm: now.toISOString(),
    });

    expect(jwtTokenController.getTokenData).toHaveBeenCalledWith(fakeAuthHeader);
    expect(getPacienteRepository.getPaciente).toHaveBeenCalledWith(fakeIdPaciente, fakeIdAplicacao, undefined);
    expect(getDadoSaudePacienteRepository.getDadoSaudePaciente).toHaveBeenCalledWith(
      fakeIdRegistro,
      fakeIdAplicacao,
      fakeIdPaciente,
    );
  });

  it("deve lançar PacienteNotFoundError se paciente não existir", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue(null);

    await expect(controller.handle(fakeIdRegistro, fakeIdPaciente, fakeAuthHeader)).rejects.toBeInstanceOf(
      PacienteNotFoundError,
    );
  });

  it("deve lançar DadoSaudePacienteNotFoundError se registro não existir", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue({ id: fakeIdPaciente });
    getDadoSaudePacienteRepository.getDadoSaudePaciente.mockResolvedValue(null);

    await expect(controller.handle(fakeIdRegistro, fakeIdPaciente, fakeAuthHeader)).rejects.toBeInstanceOf(
      DadoSaudePacienteNotFoundError,
    );
  });

  it("deve falhar se o token não retornar idAplicacao", async () => {
    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: "" });
    getPacienteRepository.getPaciente.mockImplementation(() => {
      throw new Error("Token inválido");
    });

    await expect(controller.handle(fakeIdRegistro, fakeIdPaciente, fakeAuthHeader)).rejects.toThrow("Token inválido");
  });

  it("deve lançar erro se o repositório falhar", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue({ id: fakeIdPaciente });
    getDadoSaudePacienteRepository.getDadoSaudePaciente.mockRejectedValue(new Error("Falha no banco"));

    await expect(controller.handle(fakeIdRegistro, fakeIdPaciente, fakeAuthHeader)).rejects.toThrow("Falha no banco");
  });
});
