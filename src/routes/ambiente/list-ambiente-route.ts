import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { ListAmbienteController } from "../../controllers/ambiente/list-ambiente/list-ambiente.js";
import type { ListAmbienteParams } from "../../controllers/ambiente/list-ambiente/types.js";
import { StatusAmbienteEnum } from "../../enums/ambiente/status-ambiente-enum.js";
import { authHook } from "../../hooks/auth-hook.js";
import { MongoListAmbienteRepository } from "../../repositories/ambiente/list-ambiente/mongo-list-ambiente.js";
import type { FastifyTypedInstance } from "../../types.js";

export function listAmbienteRoute(app: FastifyTypedInstance) {
  app.get(
    "/ambientes",
    {
      schema: {
        tags: ["Ambiente"],
        description: "Lista os ambientes.",
        security: [{ bearerAuth: [] }],
        headers: z.object({
          authorization: z.string().optional(),
        }),
        querystring: z.object({
          nome: z.string().optional().default("").describe("Pesquisa por nome parcial ou completo"),
          status: z
            .enum(StatusAmbienteEnum)
            .optional()
            .default(StatusAmbienteEnum.ATIVO)
            .describe("Filtra por status do ambiente"),
          limit: z.number().int().positive().default(50).describe("Limite da paginação"),
          offset: z.number().int().min(0).default(0).describe("Offset da paginação"),
        }),
        response: {
          200: z.object({
            registros: z.array(
              z.object({
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
            ),
            total: z.number(),
            limit: z.number(),
            offset: z.number(),
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
          500: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("Erro interno do servidor. Algo inesperado ocorreu ao processar a requisição."),
        },
      },
      preHandler: authHook,
    },
    (
      request: FastifyRequest<{ Querystring: ListAmbienteParams; Headers: { authorization?: string } }>,
      reply: FastifyReply,
    ) => {
      const mongoListAmbienteRepository = new MongoListAmbienteRepository();
      const listAmbienteController = new ListAmbienteController(mongoListAmbienteRepository);
      return listAmbienteController.handle(request, reply);
    },
  );
}
