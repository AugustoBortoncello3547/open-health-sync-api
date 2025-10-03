import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IGetDadoSaudePacienteRepository } from "../../../controllers/dado-saude-paciente/get-dado-saude-paciente/types.js";
import type {
  IUpdateDadoSaudePacienteRepository,
  TUpdateDadoSaudePacienteRequest,
} from "../../../controllers/dado-saude-paciente/update-dado-saude-paciente/types.js";
import type { IJwtTokenController } from "../../../controllers/token/types.js";
import { UpdateDadoSaudePacienteController } from "../../../controllers/dado-saude-paciente/update-dado-saude-paciente/update-dado-saude-paciente.js";
import { DadoSaudePacienteNotFoundError } from "../../../errors/dado-saude-paciente-not-found-error.js";
import { DadoSaudePacienteWithIdExternoAlreadyInUseError } from "../../../errors/dado-saude-paciente-with-Id-externo-already-in-use-error.js";

describe("UpdateDadoSaudePacienteController", () => {
  let getDadoSaudePacienteRepository: IGetDadoSaudePacienteRepository;
  let updateDadoSaudePacienteRepository: IUpdateDadoSaudePacienteRepository;
  let jwtTokenController: IJwtTokenController;
  let controller: UpdateDadoSaudePacienteController;

  const dadoSaudeBase = {
    id: "ds-1",
    idExterno: "old-ext",
    dados: { tipo: "pressao", valor: "120/80" },
  };

  beforeEach(() => {
    getDadoSaudePacienteRepository = {
      getDadoSaudePaciente: vi.fn(),
      getDadoSaudePacienteOnlyByIdExterno: vi.fn(),
    };

    updateDadoSaudePacienteRepository = {
      updateDadoSaudePaciente: vi.fn(),
    };

    jwtTokenController = {
      getTokenData: vi.fn(),
      getTokenFromAuthorizationHeader: vi.fn(),
      extractDatafromToken: vi.fn(),
    };

    controller = new UpdateDadoSaudePacienteController(
      getDadoSaudePacienteRepository,
      updateDadoSaudePacienteRepository,
      jwtTokenController,
    );
  });

  it("deve atualizar um dado de saúde com sucesso", async () => {
    (jwtTokenController.getTokenData as any).mockResolvedValue({ idAplicacao: "app-1" });
    (getDadoSaudePacienteRepository.getDadoSaudePaciente as any).mockResolvedValue({ ...dadoSaudeBase });
    (getDadoSaudePacienteRepository.getDadoSaudePacienteOnlyByIdExterno as any).mockResolvedValue(null);
    (updateDadoSaudePacienteRepository.updateDadoSaudePaciente as any).mockResolvedValue("ds-1");

    const updateRequest: TUpdateDadoSaudePacienteRequest = {
      idExterno: "new-ext",
      dados: { tipo: "glicemia", valor: "95" },
    };

    const result = await controller.handle("ds-1", "pac-1", updateRequest, "Bearer token");

    expect(result).toBe("ds-1");
    expect(updateDadoSaudePacienteRepository.updateDadoSaudePaciente).toHaveBeenCalledWith("ds-1", {
      ...dadoSaudeBase,
      ...updateRequest,
    });
  });

  it("deve lançar DadoSaudePacienteNotFoundError se não encontrar o registro", async () => {
    (jwtTokenController.getTokenData as any).mockResolvedValue({ idAplicacao: "app-1" });
    (getDadoSaudePacienteRepository.getDadoSaudePaciente as any).mockResolvedValue(null);

    await expect(
      controller.handle("nao-existe", "pac-1", { dados: { tipo: "peso", valor: "70kg" } }, "Bearer token"),
    ).rejects.toThrow(DadoSaudePacienteNotFoundError);
  });

  it("deve lançar DadoSaudePacienteWithIdExternoAlreadyInUseError se idExterno já estiver em uso", async () => {
    (jwtTokenController.getTokenData as any).mockResolvedValue({ idAplicacao: "app-1" });
    (getDadoSaudePacienteRepository.getDadoSaudePaciente as any).mockResolvedValue({ ...dadoSaudeBase });
    (getDadoSaudePacienteRepository.getDadoSaudePacienteOnlyByIdExterno as any).mockResolvedValue({ id: "outro" });

    await expect(controller.handle("ds-1", "pac-1", { idExterno: "duplicado" }, "Bearer token")).rejects.toThrow(
      DadoSaudePacienteWithIdExternoAlreadyInUseError,
    );
  });

  it("deve permitir atualização apenas de dados", async () => {
    (jwtTokenController.getTokenData as any).mockResolvedValue({ idAplicacao: "app-1" });
    (getDadoSaudePacienteRepository.getDadoSaudePaciente as any).mockResolvedValue({ ...dadoSaudeBase });
    (getDadoSaudePacienteRepository.getDadoSaudePacienteOnlyByIdExterno as any).mockResolvedValue(null);
    (updateDadoSaudePacienteRepository.updateDadoSaudePaciente as any).mockResolvedValue("ds-1");

    const updateRequest: TUpdateDadoSaudePacienteRequest = {
      dados: { tipo: "peso", valor: "72kg" },
    };

    const result = await controller.handle("ds-1", "pac-1", updateRequest, "Bearer token");

    expect(result).toBe("ds-1");
    expect(updateDadoSaudePacienteRepository.updateDadoSaudePaciente).toHaveBeenCalledWith("ds-1", {
      ...dadoSaudeBase,
      dados: { tipo: "peso", valor: "72kg" },
    });
  });
});
