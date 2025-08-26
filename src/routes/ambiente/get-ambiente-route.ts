import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { GetAmbienteController } from "../../controllers/Ambiente/get-ambiente/get-ambiente.js";
import type { GetAmbienteParams } from "../../controllers/Ambiente/get-ambiente/types.js";
import { StatusAmbienteEnum } from "../../enums/Ambiente/status-ambiente-enum.js";
import { MongoGetAmbienteRepository } from "../../repositories/ambiente/get-ambiente/mongo-get-ambiente.js";
import type { FastifyTypedInstance } from "../../types.js";

export function getAmbienteRoute(app: FastifyTypedInstance) {
  app.get(
    "/ambiente/:idAmbiente",
    {
      schema: {
        tags: ["Ambiente"],
        description: "Obtém um ambiente",
        params: z.object({
          idAmbiente: z.string(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            idExterno: z.string(),
            idAplicacao: z.string(),
            nome: z.string(),
            status: z.enum(StatusAmbienteEnum),
            apiKey: z.string(),
            urlWebhook: z.string(),
            tokenWebhook: z.string(),
            atualizadoEm: z.string(),
            criadoEm: z.string(),
          }),
          404: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("Ambiente não encontrado"),
          400: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("Requisição malformatada"),
        },
      },
    },
    (request: FastifyRequest<{ Params: GetAmbienteParams }>, reply: FastifyReply) => {
      const mongoGetAmbienteRepository = new MongoGetAmbienteRepository();
      const getAmbienteController = new GetAmbienteController(mongoGetAmbienteRepository);
      return getAmbienteController.handle(request, reply);
    },
  );
}
