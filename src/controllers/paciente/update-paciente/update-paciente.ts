import { EventTypeDispatchEnum } from "../../../enums/event-type-dispatch-enum.js";
import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";
import { PacienteWithIdExternoAlreadyInUseError } from "../../../errors/paciente-with-Id-externo-already-in-use-error.js";
import { MongoGetPacienteRepository } from "../../../repositories/paciente/get-paciente/mongo-get-paciente.js";
import { MongoUpdatePacienteRepository } from "../../../repositories/paciente/update-paciente/mongo-update-paciente.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IJwtTokenController } from "../../token/types.js";
import { SyncDispatchEventController } from "../../webhook/sync-dispatch-event-controller.js";
import type { IDispatchEventController } from "../../webhook/types.js";
import type { IGetPacienteRepository } from "../get-paciente/types.js";
import type { IUpdatePacienteController, IUpdatePacienteRepository, TUpdatePacienteRequest } from "./types.js";

export class UpdatePacienteController implements IUpdatePacienteController {
  constructor(
    private readonly getPacienteRepository: IGetPacienteRepository = new MongoGetPacienteRepository(),
    private readonly updatePacienteRepository: IUpdatePacienteRepository = new MongoUpdatePacienteRepository(),
    private readonly jwtTokenController: IJwtTokenController = new JwtTokenController(),
    private readonly dispatchEventController: IDispatchEventController = new SyncDispatchEventController(),
  ) {}

  async handle(
    idPaciente: string,
    idAmbiente: string,
    updatePacienteRequest: TUpdatePacienteRequest,
    authHeader?: string,
  ): Promise<string> {
    const { idAplicacao } = await this.jwtTokenController.getTokenData(authHeader);

    const paciente = await this.getPacienteRepository.getPaciente(idPaciente, idAplicacao, idAmbiente);
    if (!paciente) {
      throw new PacienteNotFoundError();
    }

    const { idExterno, dados } = updatePacienteRequest;
    if (idExterno) {
      const pacienteWithSameIdExterno = await this.getPacienteRepository.getPacienteOnlyByIdExterno(
        idExterno,
        idAplicacao,
        idAmbiente,
      );
      if (pacienteWithSameIdExterno) {
        throw new PacienteWithIdExternoAlreadyInUseError();
      }

      paciente.idExterno = idExterno;
    }

    if (dados) {
      paciente.dados = dados;
    }

    const idUpdatedPaciente = await this.updatePacienteRepository.updatePaciente(paciente.id, paciente);
    if (idUpdatedPaciente) {
      await this.dispatchEventController.dispatch(
        idAplicacao,
        idAmbiente,
        EventTypeDispatchEnum.UPDATE_PACIENTE,
        paciente,
      );
    }

    return idUpdatedPaciente;
  }
}
