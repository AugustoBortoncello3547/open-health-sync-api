import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IGetAmbienteRepository } from "../../../controllers/ambiente/get-ambiente/types.js";
import type {
  IUpdateAmbienteRepository,
  TUpdateAmbienteRequest,
} from "../../../controllers/ambiente/update-ambiente/types.js";
import type { IJwtTokenController } from "../../../controllers/token/types.js";
import { UpdateAmbienteController } from "../../../controllers/ambiente/update-ambiente/update-ambiente.js";
import { StatusAmbienteEnum } from "../../../enums/ambiente/status-ambiente-enum.js";
import { AmbienteNotFoundError } from "../../../errors/ambiente-not-found-error.js";
import { AmbienteWithIdExternoAlreadyInUseError } from "../../../errors/ambiente-with-idexterno-already-in-use-error.js";

describe("UpdateAmbienteController", () => {
  let getAmbienteRepository: IGetAmbienteRepository;
  let updateAmbienteRepository: IUpdateAmbienteRepository;
  let jwtTokenController: IJwtTokenController;
  let controller: UpdateAmbienteController;

  const ambienteBase = {
    id: "123",
    idExterno: "old-ext",
    nome: "Old Name",
    status: "ativo",
    urlWebhook: "http://old-webhook",
    tokenWebhook: "old-token",
  };

  beforeEach(() => {
    getAmbienteRepository = {
      getAmbiente: vi.fn(),
      getAmbienteOnlyByIdExterno: vi.fn(),
    };

    updateAmbienteRepository = {
      updateAmbiente: vi.fn(),
    };

    jwtTokenController = {
      getTokenData: vi.fn(),
      getTokenFromAuthorizationHeader: vi.fn(),
      extractDatafromToken: vi.fn(),
    };

    controller = new UpdateAmbienteController(getAmbienteRepository, updateAmbienteRepository, jwtTokenController);
  });

  it("deve atualizar um ambiente com sucesso", async () => {
    (jwtTokenController.getTokenData as any).mockResolvedValue({ idAplicacao: "app-1" });
    (getAmbienteRepository.getAmbiente as any).mockResolvedValue({ ...ambienteBase });
    (getAmbienteRepository.getAmbienteOnlyByIdExterno as any).mockResolvedValue(null);
    (updateAmbienteRepository.updateAmbiente as any).mockResolvedValue("123");

    const updateRequest: TUpdateAmbienteRequest = {
      idExterno: "new-ext",
      nome: "Novo Nome",
      status: StatusAmbienteEnum.INATIVO,
      urlWebhook: "http://new-webhook",
      tokenWebhook: "new-token",
    };

    const result = await controller.handle("123", updateRequest, "Bearer token");

    expect(result).toBe("123");
    expect(updateAmbienteRepository.updateAmbiente).toHaveBeenCalledWith("123", {
      ...ambienteBase,
      ...updateRequest,
    });
  });

  it("deve lançar AmbienteNotFoundError se o ambiente não existir", async () => {
    (jwtTokenController.getTokenData as any).mockResolvedValue({ idAplicacao: "app-1" });
    (getAmbienteRepository.getAmbiente as any).mockResolvedValue(null);

    await expect(controller.handle("999", { nome: "Qualquer" }, "Bearer token")).rejects.toThrow(AmbienteNotFoundError);
  });

  it("deve lançar AmbienteWithIdExternoAlreadyInUseError se idExterno já estiver em uso", async () => {
    (jwtTokenController.getTokenData as any).mockResolvedValue({ idAplicacao: "app-1" });
    (getAmbienteRepository.getAmbiente as any).mockResolvedValue({ ...ambienteBase });
    (getAmbienteRepository.getAmbienteOnlyByIdExterno as any).mockResolvedValue({ id: "outro" });

    await expect(controller.handle("123", { idExterno: "duplicado" }, "Bearer token")).rejects.toThrow(
      AmbienteWithIdExternoAlreadyInUseError,
    );
  });

  it("deve permitir atualização parcial (apenas nome)", async () => {
    (jwtTokenController.getTokenData as any).mockResolvedValue({ idAplicacao: "app-1" });
    (getAmbienteRepository.getAmbiente as any).mockResolvedValue({ ...ambienteBase });
    (getAmbienteRepository.getAmbienteOnlyByIdExterno as any).mockResolvedValue(null);
    (updateAmbienteRepository.updateAmbiente as any).mockResolvedValue("123");

    const result = await controller.handle("123", { nome: "Nome Atualizado" }, "Bearer token");

    expect(result).toBe("123");
    expect(updateAmbienteRepository.updateAmbiente).toHaveBeenCalledWith("123", {
      ...ambienteBase,
      nome: "Nome Atualizado",
    });
  });
});
