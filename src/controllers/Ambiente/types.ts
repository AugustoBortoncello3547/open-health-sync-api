import type { StatusAmbienteEnum } from "../../enums/Ambiente/status-ambiente-enum.js";

export type TAmbiente = {
  id: string;
  idExterno: string;
  idAplicacao: string;
  nome: string;
  status: StatusAmbienteEnum;
  apiKey: string;
  urlWebhook: string;
  tokenWebhook: string;
  criadoEm: Date;
  atualizadoEm: Date;
};
