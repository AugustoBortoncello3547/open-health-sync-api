import type { EventTypeDispatchEnum } from "../../enums/event-type-dispatch-enum.js";

export type IDispatchEventController = {
  dispatch(idAplicacao: string, idAmbiente: string, event: EventTypeDispatchEnum, data: any): Promise<boolean>;
};
