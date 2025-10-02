import type { EventTypeDispatchEnum } from "../../enums/event-type-dispatch-enum.js";
import { MongoGetAmbienteRepository } from "../../repositories/ambiente/get-ambiente/mongo-get-ambiente.js";
import type { IGetAmbienteRepository } from "../ambiente/get-ambiente/types.js";
import type { IDispatchEventController } from "./types.js";

export class SyncDispatchEventController implements IDispatchEventController {
  constructor(private readonly getAmbienteRepository: IGetAmbienteRepository = new MongoGetAmbienteRepository()) {}

  async dispatch(idAplicacao: string, idAmbiente: string, event: EventTypeDispatchEnum, data: any): Promise<boolean> {
    try {
      const ambiente = await this.getAmbienteRepository.getAmbiente(idAmbiente, idAplicacao);
      if (!ambiente) {
        return false;
      }

      const urlToDispatch = ambiente.urlWebhook;
      const safeTokenToDispatch = ambiente.tokenWebhook;

      if (!urlToDispatch) {
        return false;
      }

      const response = await fetch(urlToDispatch, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Token": safeTokenToDispatch,
        },
        body: JSON.stringify({
          event,
          data,
        }),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
