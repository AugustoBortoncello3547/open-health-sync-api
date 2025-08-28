import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { GetAmbienteController } from "../../controllers/Ambiente/get-ambiente/get-ambiente.js";
import type { GetAmbienteParams } from "../../controllers/Ambiente/get-ambiente/types.js";
import { StatusAmbienteEnum } from "../../enums/Ambiente/status-ambiente-enum.js";
import { MongoGetAmbienteRepository } from "../../repositories/ambiente/get-ambiente/mongo-get-ambiente.js";
import type { FastifyTypedInstance } from "../../types.js";
import { authMiddleware } from "../../middlewares/auth/auth-middleware.js";

export function getAmbienteRoute(app: FastifyTypedInstance) {
  app.get(
    "/ambiente/:idAmbiente",
    {
      schema: {
        tags: ["Ambiente"],
        description: "Obtém um ambiente.",
        security: [{ bearerAuth: [] }],
        headers: z.object({
          authorization: z.string().optional(),
        }),
        params: z.object({
          idAmbiente: z.string().describe("Identificador do ambiente, podendo ser o id interno ou o idExterno."),
        }),
        response: {
          200: z.object({
            id: z.string().describe("Identificador interno do ambiente, gerado pelo sistema."),
            idExterno: z.string().describe("Identificador externo do ambiente, definido pelo cliente na criação."),
            nome: z.string().describe("Nome do ambiente."),
            status: z.enum(StatusAmbienteEnum).describe("Status atual do ambiente."),
            apiKey: z
              .string()
              .describe(
                "Chave de autenticação exclusiva do ambiente, usada para salvar dados dos pacientes e seus dados.",
              ),
            urlWebhook: z
              .string()
              .describe("URL do webhook para envio de notificações ou atualizações dos pacientes e seus dados."),
            tokenWebhook: z
              .string()
              .describe("Token de autenticação usado para validar requisições enviadas ao webhook."),
            atualizadoEm: z.string().describe("Data e hora da última atualização do ambiente."),
            criadoEm: z.string().describe("Data e hora de criação do ambiente."),
          }),
          400: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("A requisição não pôde ser processada devido a dados inválidos ou formato incorreto do payload."),
          401: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("Autenticação necessária ou inválida. O token ou credenciais fornecidos não são válidos."),
          404: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("Ambiente não encontrado"),
          500: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("Erro interno do servidor. Algo inesperado ocorreu ao processar a requisição."),
        },
      },
      preHandler: authMiddleware,
    },
    (
      request: FastifyRequest<{ Params: GetAmbienteParams; Headers: { authorization?: string } }>,
      reply: FastifyReply,
    ) => {
      console.log("Chegou");
      const mongoGetAmbienteRepository = new MongoGetAmbienteRepository();
      const getAmbienteController = new GetAmbienteController(mongoGetAmbienteRepository);
      return getAmbienteController.handle(request, reply);
    },
  );
}
