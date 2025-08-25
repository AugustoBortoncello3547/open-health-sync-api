import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { CreateAmbienteController } from "../../controllers/Ambiente/create-ambiente/create-ambiente.js";
import type { TCreateAmbienteParams } from "../../controllers/Ambiente/create-ambiente/types.js";
import type { FastifyTypedInstance } from "../../types.js";
import { MongoCreateAmbienteRepository } from "../../repositories/ambiente/create-ambiente/mongo-create-ambiente.js";

export async function createAmbienteRoute(app: FastifyTypedInstance) {
  app.post(
    "/ambiente",
    {
      schema: {
        tags: ["Ambiente"],
        description: "Criar novo ambiente",
        body: z.object({
          idExterno: z.string("Seu id representado o ambiente").optional(),
          nome: z.string("O nome do ambiente"),
          urlWebhook: z.string("A URL do webhook que os eventos serão disparados").optional(),
          tokenWebhook: z.string("O token para ser enviado junto com os eventos").optional(),
        }),
        response: {
          201: z.object({ id: z.string() }).describe("Ambiente criado com sucesso!"),
          400: z.object({
            error: z.string().describe("Tipo do erro"),
            message: z.string().describe("Mensagem resumida do erro"),
            statusCode: z.number().describe("Código HTTP do erro").optional(),
            details: z
              .object({
                issues: z
                  .array(
                    z.object({
                      keyword: z.string().describe("Código do tipo de erro"),
                      instancePath: z.string().describe("Caminho do campo que falhou"),
                      schemaPath: z.string().describe("Caminho no schema que causou o erro"),
                      message: z.string().describe("Mensagem de validação"),
                    }),
                  )
                  .describe("Lista de erros de validação"),
                method: z.string().describe("Método HTTP da requisição"),
                url: z.string().describe("URL da requisição"),
              })
              .optional(),
          }),
          409: z.object({
            error: z.string().describe("Tipo do erro"),
            message: z.string().describe("Mensagem resumida e legível do erro"),
          }),
          500: z.object({ message: z.string() }).describe("Erro Interno no servidor"),
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
