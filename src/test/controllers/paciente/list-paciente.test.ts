import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListPacienteController } from "../../../controllers/paciente/list-paciente/list-paciente.js";

describe("ListPacienteController", () => {
  const fakeIdAmbiente = "amb-123";
  const fakeIdAplicacao = "app-123";
  const fakeAuthHeader = "Bearer token-123";

  const now = new Date();
  const fakePacientes = [
    { id: "pac-001", dados: { nome: "Maria" }, atualizadoEm: now, criadoEm: now },
    { id: "pac-002", dados: { nome: "João" }, atualizadoEm: now, criadoEm: now },
  ];

  const listFilters = { limit: 10, offset: 0 };

  let listPacienteRepository: any;
  let getAmbienteController: any;
  let jwtTokenController: any;
  let controller: ListPacienteController;

  beforeEach(() => {
    listPacienteRepository = { listPaciente: vi.fn() };
    getAmbienteController = { validateAmbienteIsAvailable: vi.fn() };
    jwtTokenController = { getTokenData: vi.fn() };

    controller = new ListPacienteController(listPacienteRepository, getAmbienteController, jwtTokenController);

    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: fakeIdAplicacao });
  });

  it("deve listar pacientes com sucesso", async () => {
    listPacienteRepository.listPaciente.mockResolvedValue(fakePacientes);

    const result = await controller.handle(fakeIdAmbiente, listFilters, fakeAuthHeader);

    expect(result).toEqual({
      registros: fakePacientes.map((p) => ({
        ...p,
        atualizadoEm: now.toISOString(),
        criadoEm: now.toISOString(),
      })),
      total: fakePacientes.length,
      limit: listFilters.limit,
      offset: listFilters.offset,
    });

    expect(jwtTokenController.getTokenData).toHaveBeenCalledWith(fakeAuthHeader);
    expect(getAmbienteController.validateAmbienteIsAvailable).toHaveBeenCalledWith(fakeIdAmbiente, fakeIdAplicacao);
    expect(listPacienteRepository.listPaciente).toHaveBeenCalledWith(listFilters, fakeIdAplicacao, fakeIdAmbiente);
  });

  it("deve lançar erro se o ambiente não estiver disponível", async () => {
    getAmbienteController.validateAmbienteIsAvailable.mockRejectedValue(new Error("Ambiente inválido"));

    await expect(controller.handle(fakeIdAmbiente, listFilters, fakeAuthHeader)).rejects.toThrow("Ambiente inválido");
  });

  it("deve retornar lista vazia corretamente", async () => {
    listPacienteRepository.listPaciente.mockResolvedValue([]);

    const result = await controller.handle(fakeIdAmbiente, listFilters, fakeAuthHeader);

    expect(result).toEqual({
      registros: [],
      total: 0,
      limit: listFilters.limit,
      offset: listFilters.offset,
    });
  });

  it("deve falhar se o token não retornar idAplicacao", async () => {
    jwtTokenController.getTokenData.mockResolvedValue({ idAplicacao: "" });
    getAmbienteController.validateAmbienteIsAvailable.mockImplementation(() => {
      throw new Error("Token inválido");
    });

    await expect(controller.handle(fakeIdAmbiente, listFilters, fakeAuthHeader)).rejects.toThrow("Token inválido");
  });

  it("deve lançar erro se o repositório falhar", async () => {
    listPacienteRepository.listPaciente.mockRejectedValue(new Error("Falha no banco"));

    await expect(controller.handle(fakeIdAmbiente, listFilters, fakeAuthHeader)).rejects.toThrow("Falha no banco");
  });
});
