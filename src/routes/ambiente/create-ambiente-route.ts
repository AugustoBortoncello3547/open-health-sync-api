import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { CreateAmbienteController } from "../../controllers/Ambiente/create-ambiente/create-ambiente.js";
import type { TCreateAmbienteParams } from "../../controllers/Ambiente/create-ambiente/types.js";
import { MongoCreateAmbienteRepository } from "../../repositories/ambiente/create-ambiente/mongo-create-ambiente.js";
import type { FastifyTypedInstance } from "../../types.js";

export async function createAmbienteRoute(app: FastifyTypedInstance) {
  app.post(
    "/ambiente",
    {
      schema: {
        tags: ["Ambiente"],
        description: "Criar novo ambiente.",
        body: z.object({
          idExterno: z.string().optional().describe("Identificador externo do ambiente, definido pelo cliente."),
          nome: z.string().describe("Nome do ambiente."),
          urlWebhook: z
            .string()
            .optional()
            .describe("URL do webhook que receberá notificações ou eventos dos pacientes e seus dados."),
          tokenWebhook: z
            .string()
            .optional()
            .describe("Token de autenticação que será enviado junto com os eventos do webhook."),
        }),
        response: {
          201: z
            .object({ id: z.string().describe("O id gerado pela aplicação.") })
            .describe("Ambiente criado com sucesso."),
          400: z
            .object({
              error: z.string().describe("Tipo do erro, usado para identificação do problema."),
              message: z.string().describe("Mensagem resumida e legível explicando o motivo do erro."),
              statusCode: z.number().optional().describe("Código HTTP retornado."),
              details: z
                .object({
                  issues: z
                    .array(
                      z.object({
                        keyword: z
                          .string()
                          .describe("Código do tipo de erro de validação (ex.: 'invalid_type', 'required')."),
                        instancePath: z.string().describe("Caminho do campo que falhou na validação."),
                        schemaPath: z.string().describe("Caminho no schema que causou o erro."),
                        message: z.string().describe("Mensagem detalhada de validação, legível para o usuário."),
                      }),
                    )
                    .describe("Lista de erros de validação detectados no payload."),
                  method: z.string().describe("Método HTTP da requisição que causou o erro."),
                  url: z.string().describe("URL da requisição que gerou o erro."),
                })
                .optional()
                .describe(
                  "Detalhes adicionais sobre o erro, incluindo validações específicas e contexto da requisição.",
                ),
            })
            .describe("A requisição não pôde ser processada devido a dados inválidos ou formato incorreto do payload."),
          409: z
            .object({
              error: z.string().describe("Tipo do erro, indicando conflito com o estado atual do recurso."),
              message: z
                .string()
                .describe(
                  "Mensagem legível explicando o motivo do conflito, como duplicidade de dados ou operação inválida.",
                ),
            })
            .describe(
              "Conflito ao tentar criar ou atualizar o recurso, geralmente devido a duplicidade ou inconsistência de dados.",
            ),
          500: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("Erro interno do servidor. Algo inesperado ocorreu ao processar a requisição."),
        },
      },
    },
    (request: FastifyRequest<{ Body: TCreateAmbienteParams }>, reply: FastifyReply) => {
      const mongoCreateAmbienteRepository = new MongoCreateAmbienteRepository();
      const createAmbienteController = new CreateAmbienteController(mongoCreateAmbienteRepository);
      return createAmbienteController.handle(request, reply);
    },
  );
}
