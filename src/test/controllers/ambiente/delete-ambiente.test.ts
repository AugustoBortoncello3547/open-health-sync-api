import { describe, it, expect, vi, beforeEach } from "vitest";
import { AmbienteNotFoundError } from "../../../errors/ambiente-not-found-error.js";
import { AmbienteWithPacientesError } from "../../../errors/ambiente-with-pacientes-error.js";
import { DeleteAmbienteController } from "../../../controllers/ambiente/delete-ambiente/delete-ambiente.js";

describe("DeleteAmbienteController", () => {
  let deleteAmbienteController: DeleteAmbienteController;
  let getAmbienteRepositoryMock: any;
  let deleteAmbienteRepositoryMock: any;
  let listPacienteRepositoryMock: any;
  let jwtTokenControllerMock: any;

  beforeEach(() => {
    getAmbienteRepositoryMock = { getAmbiente: vi.fn() };
    deleteAmbienteRepositoryMock = { deleteAmbiente: vi.fn() };
    listPacienteRepositoryMock = { listPaciente: vi.fn() };
    jwtTokenControllerMock = { getTokenData: vi.fn() };

    deleteAmbienteController = new DeleteAmbienteController(
      getAmbienteRepositoryMock,
      deleteAmbienteRepositoryMock,
      listPacienteRepositoryMock,
      jwtTokenControllerMock,
    );
  });

  it("deve deletar ambiente com sucesso quando não possui pacientes", async () => {
    jwtTokenControllerMock.getTokenData.mockResolvedValue({ idAplicacao: "app123" });
    getAmbienteRepositoryMock.getAmbiente.mockResolvedValue({ id: "amb1" });
    listPacienteRepositoryMock.listPaciente.mockResolvedValue([]); // sem pacientes

    await deleteAmbienteController.handle("amb1", "Bearer token");

    expect(getAmbienteRepositoryMock.getAmbiente).toHaveBeenCalledWith("amb1", "app123");
    expect(deleteAmbienteRepositoryMock.deleteAmbiente).toHaveBeenCalledWith("amb1", "app123");
  });

  it("deve lançar erro se o ambiente não for encontrado", async () => {
    jwtTokenControllerMock.getTokenData.mockResolvedValue({ idAplicacao: "app123" });
    getAmbienteRepositoryMock.getAmbiente.mockResolvedValue(null);

    await expect(deleteAmbienteController.handle("amb1", "Bearer token")).rejects.toThrow(AmbienteNotFoundError);

    expect(deleteAmbienteRepositoryMock.deleteAmbiente).not.toHaveBeenCalled();
  });

  it("deve lançar erro se o ambiente possuir pacientes", async () => {
    jwtTokenControllerMock.getTokenData.mockResolvedValue({ idAplicacao: "app123" });
    getAmbienteRepositoryMock.getAmbiente.mockResolvedValue({ id: "amb1" });
    listPacienteRepositoryMock.listPaciente.mockResolvedValue([{}]); // retornando paciente

    await expect(deleteAmbienteController.handle("amb1", "Bearer token")).rejects.toThrow(AmbienteWithPacientesError);

    expect(deleteAmbienteRepositoryMock.deleteAmbiente).not.toHaveBeenCalled();
  });
});
