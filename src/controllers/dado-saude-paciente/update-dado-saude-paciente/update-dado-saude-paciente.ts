import { EventTypeDispatchEnum } from "../../../enums/event-type-dispatch-enum.js";
import { DadoSaudePacienteNotFoundError } from "../../../errors/dado-saude-paciente-not-found-error.js";
import { DadoSaudePacienteWithIdExternoAlreadyInUseError } from "../../../errors/dado-saude-paciente-with-Id-externo-already-in-use-error.js";
import { PacienteNotFoundError } from "../../../errors/paciente-not-found-error.js";
import { MongoGetDadoSaudePacienteRepository } from "../../../repositories/dado-saude-paciente/get-dado-saude-paciente/mongo-get-dado-saude-paciente.js";
import { MongoUpdateDadoSaudePacienteRepository } from "../../../repositories/dado-saude-paciente/update-dado-saude-paciente/mongo-update-dado-saude-paciente.js";
import { MongoGetPacienteRepository } from "../../../repositories/paciente/get-paciente/mongo-get-paciente.js";
import type { IGetPacienteRepository } from "../../paciente/get-paciente/types.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IJwtTokenController } from "../../token/types.js";
import { SyncDispatchEventController } from "../../webhook/sync-dispatch-event-controller.js";
import type { IDispatchEventController } from "../../webhook/types.js";
import type { IGetDadoSaudePacienteRepository } from "../get-dado-saude-paciente/types.js";
import type {
  IUpdateDadoSaudePacienteController,
  IUpdateDadoSaudePacienteRepository,
  TUpdateDadoSaudePacienteRequest,
} from "./types.js";

export class UpdateDadoSaudePacienteController implements IUpdateDadoSaudePacienteController {
  constructor(
    private readonly getDadoSaudePacienteRepository: IGetDadoSaudePacienteRepository = new MongoGetDadoSaudePacienteRepository(),
    private readonly updateDadoSaudePacienteRepository: IUpdateDadoSaudePacienteRepository = new MongoUpdateDadoSaudePacienteRepository(),
    private readonly jwtTokenController: IJwtTokenController = new JwtTokenController(),
    private readonly getPacienteRepository: IGetPacienteRepository = new MongoGetPacienteRepository(),
    private readonly dispatchEventController: IDispatchEventController = new SyncDispatchEventController(),
  ) {}

  async handle(
    idRegistro: string,
    idPaciente: string,
    updateDadoSaudePacienteRequest: TUpdateDadoSaudePacienteRequest,
    authHeader?: string,
  ): Promise<string> {
    const { idAplicacao } = await this.jwtTokenController.getTokenData(authHeader);

    const paciente = await this.getPacienteRepository.getPaciente(idPaciente, idAplicacao, undefined);
    if (!paciente) {
      throw new PacienteNotFoundError();
    }

    const dadoSaudePaciente = await this.getDadoSaudePacienteRepository.getDadoSaudePaciente(
      idRegistro,
      idAplicacao,
      idPaciente,
    );
    if (!dadoSaudePaciente) {
      throw new DadoSaudePacienteNotFoundError();
    }

    const { idExterno, dados } = updateDadoSaudePacienteRequest;
    if (idExterno) {
      const dadoSaudePacienteWithSameIdExterno =
        await this.getDadoSaudePacienteRepository.getDadoSaudePacienteOnlyByIdExterno(
          idExterno,
          idAplicacao,
          idPaciente,
        );
      if (dadoSaudePacienteWithSameIdExterno) {
        throw new DadoSaudePacienteWithIdExternoAlreadyInUseError();
      }

      dadoSaudePaciente.idExterno = idExterno;
    }

    if (dados) {
      dadoSaudePaciente.dados = dados;
    }

    const idUpdatedPaciente = await this.updateDadoSaudePacienteRepository.updateDadoSaudePaciente(
      dadoSaudePaciente.id,
      dadoSaudePaciente,
    );
    if (idUpdatedPaciente) {
      await this.dispatchEventController.dispatch(
        idAplicacao,
        paciente.idAmbiente,
        EventTypeDispatchEnum.UPDATE_DADO_SAUDE_PACIENTE,
        dadoSaudePaciente,
      );
    }

    return idUpdatedPaciente;
  }
}
