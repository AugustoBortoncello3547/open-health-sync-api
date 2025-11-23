import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IGetPacienteRepository } from "../../../controllers/paciente/get-paciente/types.js";
import type {
  IUpdatePacienteRepository,
  TUpdatePacienteRequest,
} from "../../../controllers/paciente/update-paciente/types.js";
import { UpdatePacienteController } from "../../../controllers/paciente/update-paciente/update-paciente.js";
import type { IJwtTokenController } from "../../../controllers/token/types.js";
import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";
import { PacienteWithIdExternoAlreadyInUseError } from "../../../errors/paciente-with-Id-externo-already-in-use-error.js";
import type { IDispatchEventController } from "../../../controllers/webhook/types.js";

describe("UpdatePacienteController", () => {
  let getPacienteRepository: IGetPacienteRepository;
  let updatePacienteRepository: IUpdatePacienteRepository;
  let jwtTokenController: IJwtTokenController;
  let controller: UpdatePacienteController;
  let dispatchEventController: IDispatchEventController;

  const pacienteBase = {
    id: "pac-1",
    idExterno: "old-ext",
    dados: { nome: "João" },
  };

  beforeEach(() => {
    getPacienteRepository = {
      getPaciente: vi.fn(),
      getPacienteOnlyByIdExterno: vi.fn(),
    };

    updatePacienteRepository = {
      updatePaciente: vi.fn(),
    };

    jwtTokenController = {
      getTokenData: vi.fn(),
      getTokenFromAuthorizationHeader: vi.fn(),
      extractDatafromToken: vi.fn(),
    };

    dispatchEventController = {
      dispatch: vi.fn().mockResolvedValue(undefined),
    };

    controller = new UpdatePacienteController(
      getPacienteRepository,
      updatePacienteRepository,
      jwtTokenController,
      dispatchEventController,
    );
  });

  it("deve atualizar um paciente com sucesso", async () => {
    (jwtTokenController.getTokenData as any).mockResolvedValue({ idAplicacao: "app-1" });
    (getPacienteRepository.getPaciente as any).mockResolvedValue({ ...pacienteBase });
    (getPacienteRepository.getPacienteOnlyByIdExterno as any).mockResolvedValue(null);
    (updatePacienteRepository.updatePaciente as any).mockResolvedValue("pac-1");

    const updateRequest: TUpdatePacienteRequest = {
      idExterno: "new-ext",
      dados: { nome: "Maria", idade: 30 },
    };

    const result = await controller.handle("pac-1", "amb-1", updateRequest, "Bearer token");

    expect(result).toBe("pac-1");
    expect(updatePacienteRepository.updatePaciente).toHaveBeenCalledWith("pac-1", {
      ...pacienteBase,
      ...updateRequest,
    });
  });

  it("deve lançar PacienteNotFoundError se paciente não existir", async () => {
    (jwtTokenController.getTokenData as any).mockResolvedValue({ idAplicacao: "app-1" });
    (getPacienteRepository.getPaciente as any).mockResolvedValue(null);

    await expect(
      controller.handle("nao-existe", "amb-1", { dados: { nome: "Teste" } }, "Bearer token"),
    ).rejects.toThrow(PacienteNotFoundError);
  });

  it("deve lançar PacienteWithIdExternoAlreadyInUseError se idExterno já estiver em uso", async () => {
    (jwtTokenController.getTokenData as any).mockResolvedValue({ idAplicacao: "app-1" });
    (getPacienteRepository.getPaciente as any).mockResolvedValue({ ...pacienteBase });
    (getPacienteRepository.getPacienteOnlyByIdExterno as any).mockResolvedValue({ id: "outro-paciente" });

    await expect(controller.handle("pac-1", "amb-1", { idExterno: "duplicado" }, "Bearer token")).rejects.toThrow(
      PacienteWithIdExternoAlreadyInUseError,
    );
  });

  it("deve permitir atualização apenas de dados", async () => {
    (jwtTokenController.getTokenData as any).mockResolvedValue({ idAplicacao: "app-1" });
    (getPacienteRepository.getPaciente as any).mockResolvedValue({ ...pacienteBase });
    (getPacienteRepository.getPacienteOnlyByIdExterno as any).mockResolvedValue(null);
    (updatePacienteRepository.updatePaciente as any).mockResolvedValue("pac-1");

    const updateRequest: TUpdatePacienteRequest = {
      dados: { nome: "Carlos" },
    };

    const result = await controller.handle("pac-1", "amb-1", updateRequest, "Bearer token");

    expect(result).toBe("pac-1");
    expect(updatePacienteRepository.updatePaciente).toHaveBeenCalledWith("pac-1", {
      ...pacienteBase,
      dados: { nome: "Carlos" },
    });
  });
});
