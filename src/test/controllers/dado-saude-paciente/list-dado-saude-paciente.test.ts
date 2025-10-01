import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListDadoSaudePacienteController } from "../../../controllers/dado-saude-paciente/list-dado-saude-paciente/list-dado-saude-paciente.js";
import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";

describe("ListDadoSaudePacienteController", () => {
  const fakeIdPaciente = "pac-123";
  const fakeIdAplicacao = "app-123";
  const fakeAuthHeader = "Bearer token-123";

  const now = new Date();
  const fakeRegistros = [
    { id: "ds-001", dados: { tipo: "pressao", valor: "120/80" }, atualizadoEm: now, criadoEm: now },
    { id: "ds-002", dados: { tipo: "glicemia", valor: "90" }, atualizadoEm: now, criadoEm: now },
  ];

  const listFilters = { limit: 10, offset: 0 };

  let listDadoSaudePacienteRepository: any;
  let getPacienteRepository: any;
  let jwtTokenController: any;
  let controller: ListDadoSaudePacienteController;

  beforeEach(() => {
    listDadoSaudePacienteRepository = { listDadoSaudePaciente: vi.fn() };
    getPacienteRepository = { getPaciente: vi.fn() };
    jwtTokenController = { getTokenData: vi.fn() };

    controller = new ListDadoSaudePacienteController(
      listDadoSaudePacienteRepository,
      getPacienteRepository,
      jwtTokenController,
    );

    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: fakeIdAplicacao });
  });

  it("deve listar dados de saúde do paciente com sucesso", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue({ id: fakeIdPaciente });
    listDadoSaudePacienteRepository.listDadoSaudePaciente.mockResolvedValue(fakeRegistros);

    const result = await controller.handle(fakeIdPaciente, listFilters, fakeAuthHeader);

    expect(result).toEqual({
      registros: fakeRegistros.map((r) => ({
        ...r,
        atualizadoEm: now.toISOString(),
        criadoEm: now.toISOString(),
      })),
      total: fakeRegistros.length,
      limit: listFilters.limit,
      offset: listFilters.offset,
    });

    expect(jwtTokenController.getTokenData).toHaveBeenCalledWith(fakeAuthHeader);
    expect(getPacienteRepository.getPaciente).toHaveBeenCalledWith(fakeIdPaciente, fakeIdAplicacao, undefined);
    expect(listDadoSaudePacienteRepository.listDadoSaudePaciente).toHaveBeenCalledWith(
      listFilters,
      fakeIdAplicacao,
      fakeIdPaciente,
    );
  });

  it("deve lançar PacienteNotFoundError se paciente não existir", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue(null);

    await expect(controller.handle(fakeIdPaciente, listFilters, fakeAuthHeader)).rejects.toBeInstanceOf(
      PacienteNotFoundError,
    );
  });

  it("deve retornar lista vazia corretamente", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue({ id: fakeIdPaciente });
    listDadoSaudePacienteRepository.listDadoSaudePaciente.mockResolvedValue([]);

    const result = await controller.handle(fakeIdPaciente, listFilters, fakeAuthHeader);

    expect(result).toEqual({
      registros: [],
      total: 0,
      limit: listFilters.limit,
      offset: listFilters.offset,
    });
  });

  it("deve falhar se o token não retornar idAplicacao", async () => {
    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: "" });
    getPacienteRepository.getPaciente.mockImplementation(() => {
      throw new Error("Token inválido");
    });

    await expect(controller.handle(fakeIdPaciente, listFilters, fakeAuthHeader)).rejects.toThrow("Token inválido");
  });

  it("deve lançar erro se o repositório falhar", async () => {
    getPacienteRepository.getPaciente.mockResolvedValue({ id: fakeIdPaciente });
    listDadoSaudePacienteRepository.listDadoSaudePaciente.mockRejectedValue(new Error("Falha no banco"));

    await expect(controller.handle(fakeIdPaciente, listFilters, fakeAuthHeader)).rejects.toThrow("Falha no banco");
  });
});
