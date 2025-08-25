import type { FastifyReply, FastifyRequest } from "fastify";
import type { StatusAmbienteEnum } from "../../../enums/Ambiente/status-ambiente-enum.js";
import type { TAmbiente } from "../types.js";

export interface ICreateAmbienteController {
  handle(request: FastifyRequest<{ Body: TCreateAmbienteParams }>, reply: FastifyReply): Promise<void>;
}

export type TCreateAmbienteParams = Omit<
  TAmbiente,
  "id" | "status" | "apiKey" | "idAplicacao" | "atualizadoEm" | "criadoEm"
>;

export type TCreateAmbiente = TCreateAmbienteParams & {
  status: StatusAmbienteEnum;
  apiKey: string;
  idAplicacao: string;
};

export interface ICreateAmbienteRepository {
  createAmbiente(aplicacacao: TCreateAmbiente): Promise<string>;
}
