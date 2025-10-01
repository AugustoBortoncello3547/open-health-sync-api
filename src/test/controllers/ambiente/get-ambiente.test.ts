import { describe, it, expect, vi, beforeEach } from "vitest";
import { AmbienteNotFoundError } from "../../../errors/ambiente-not-found-error.js";
import { AmbienteUnavailableError } from "../../../errors/ambiente-unavailable-error.js";
import { StatusAmbienteEnum } from "../../../enums/ambiente/status-ambiente-enum.js";
import { GetAmbienteController } from "../../../controllers/ambiente/get-ambiente/get-ambiente.js";

describe("GetAmbienteController", () => {
  let getAmbienteController: GetAmbienteController;
  let getAmbienteRepositoryMock: any;
  let jwtTokenControllerMock: any;

  beforeEach(() => {
    getAmbienteRepositoryMock = { getAmbiente: vi.fn() };
    jwtTokenControllerMock = { getTokenData: vi.fn() };

    getAmbienteController = new GetAmbienteController(getAmbienteRepositoryMock, jwtTokenControllerMock);
  });

  describe("handle", () => {
    it("deve retornar ambiente formatado corretamente", async () => {
      jwtTokenControllerMock.getTokenData.mockResolvedValue({ idAplicacao: "app123" });

      const ambienteFake = {
        id: "amb1",
        idExterno: "ext1",
        idAplicacao: "app123",
        nome: "Ambiente Teste",
        status: StatusAmbienteEnum.ATIVO,
        apiKey: "chave123",
        urlWebhook: "http://webhook",
        tokenWebhook: "token123",
        criadoEm: new Date("2025-01-01T00:00:00Z"),
        atualizadoEm: new Date("2025-01-02T00:00:00Z"),
      };

      getAmbienteRepositoryMock.getAmbiente.mockResolvedValue(ambienteFake);

      const result = await getAmbienteController.handle("amb1", "Bearer token");

      expect(result).toEqual({
        ...ambienteFake,
        criadoEm: ambienteFake.criadoEm.toISOString(),
        atualizadoEm: ambienteFake.atualizadoEm.toISOString(),
      });
      expect(getAmbienteRepositoryMock.getAmbiente).toHaveBeenCalledWith("amb1", "app123");
    });

    it("deve lançar erro se ambiente não for encontrado", async () => {
      jwtTokenControllerMock.getTokenData.mockResolvedValue({ idAplicacao: "app123" });
      getAmbienteRepositoryMock.getAmbiente.mockResolvedValue(null);

      await expect(getAmbienteController.handle("amb1", "Bearer token")).rejects.toThrow(AmbienteNotFoundError);
    });
  });

  describe("validateAmbienteIsAvailable", () => {
    it("não deve lançar erro quando ambiente está ATIVO", async () => {
      const ambienteFake = {
        id: "amb1",
        idAplicacao: "app123",
        status: StatusAmbienteEnum.ATIVO,
      };

      getAmbienteRepositoryMock.getAmbiente.mockResolvedValue(ambienteFake);

      await expect(getAmbienteController.validateAmbienteIsAvailable("amb1", "app123")).resolves.not.toThrow();
    });

    it("deve lançar erro se ambiente não for encontrado", async () => {
      getAmbienteRepositoryMock.getAmbiente.mockResolvedValue(null);

      await expect(getAmbienteController.validateAmbienteIsAvailable("amb1", "app123")).rejects.toThrow(
        AmbienteNotFoundError,
      );
    });

    it("deve lançar erro se ambiente não estiver ATIVO", async () => {
      const ambienteFake = {
        id: "amb1",
        idAplicacao: "app123",
        status: StatusAmbienteEnum.INATIVO,
      };

      getAmbienteRepositoryMock.getAmbiente.mockResolvedValue(ambienteFake);

      await expect(getAmbienteController.validateAmbienteIsAvailable("amb1", "app123")).rejects.toThrow(
        AmbienteUnavailableError,
      );
    });
  });
});
