import { EventTypeDispatchEnum } from "../../../enums/event-type-dispatch-enum.js";
import { PacienteWithIdExternoAlreadyInUseError } from "../../../errors/paciente-with-Id-externo-already-in-use-error.js";
import { MongoCreatePacienteRepository } from "../../../repositories/paciente/create-paciente/mongo-create-paciente.js";
import { MongoGetPacienteRepository } from "../../../repositories/paciente/get-paciente/mongo-get-paciente.js";
import { GetAmbienteController } from "../../ambiente/get-ambiente/get-ambiente.js";
import type { IGetAmbienteController } from "../../ambiente/get-ambiente/types.js";
import { JwtTokenController } from "../../token/jwt-token-controller.js";
import type { IJwtTokenController } from "../../token/types.js";
import { SyncDispatchEventController } from "../../webhook/sync-dispatch-event-controller.js";
import type { IDispatchEventController } from "../../webhook/types.js";
import type { IGetPacienteRepository } from "../get-paciente/types.js";
import type { ICreatePacienteController, ICreatePacienteRepository, TCreatePacienteRequest } from "./types.js";

export class CreatePacienteController implements ICreatePacienteController {
  constructor(
    private readonly createPacienteRepository: ICreatePacienteRepository = new MongoCreatePacienteRepository(),
    private readonly getPacienteRepository: IGetPacienteRepository = new MongoGetPacienteRepository(),
    private readonly getAmbienteController: IGetAmbienteController = new GetAmbienteController(),
    private readonly jwtTokenController: IJwtTokenController = new JwtTokenController(),
    private readonly dispatchEventController: IDispatchEventController = new SyncDispatchEventController(),
  ) {}

  async handle(
    idAmbiente: string,
    createPacienteRequest: TCreatePacienteRequest,
    authHeader?: string,
  ): Promise<string> {
    const { idAplicacao } = await this.jwtTokenController.getTokenData(authHeader);

    await this.getAmbienteController.validateAmbienteIsAvailable(idAmbiente, idAplicacao);

    const pacienteWithSameIdExterno = await this.getPacienteRepository.getPacienteOnlyByIdExterno(
      createPacienteRequest.idExterno,
      idAplicacao,
      idAmbiente,
    );
    if (pacienteWithSameIdExterno) {
      throw new PacienteWithIdExternoAlreadyInUseError();
    }

    const idPaciente = await this.createPacienteRepository.createPaciente({
      idAmbiente: idAmbiente,
      idAplicacao: idAplicacao,
      ...createPacienteRequest,
    });

    const pacienteCreated = await this.getPacienteRepository.getPaciente(idPaciente, idAplicacao, idAmbiente);
    if (pacienteCreated) {
      await this.dispatchEventController.dispatch(
        idAplicacao,
        idAmbiente,
        EventTypeDispatchEnum.CREATE_PACIENTE,
        pacienteCreated,
      );
    }

    return idPaciente;
  }
}
