import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { DeleteAmbienteController } from "../../controllers/ambiente/delete-ambiente/delete-ambiente.js";
import type { DeleteAmbienteParams } from "../../controllers/ambiente/delete-ambiente/types.js";
import { authHook } from "../../hooks/auth-hook.js";
import { MongoDeleteAmbienteRepository } from "../../repositories/ambiente/delete-ambiente/mongo-delete-ambiente.js";
import { MongoGetAmbienteRepository } from "../../repositories/ambiente/get-ambiente/mongo-get-ambiente.js";
import type { FastifyTypedInstance } from "../../types.js";

export function deleteAmbienteRoute(app: FastifyTypedInstance) {
  app.delete(
    "/ambiente/:idAmbiente",
    {
      schema: {
        tags: ["Ambiente"],
        description: "Deleta um ambiente.",
        security: [{ bearerAuth: [] }],
        headers: z.object({
          authorization: z.string().optional(),
        }),
        params: z.object({
          idAmbiente: z.string().describe("Identificador do ambiente, podendo ser o id interno ou o idExterno."),
        }),
        response: {
          200: z.null(),
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
      preHandler: authHook,
    },
    (
      request: FastifyRequest<{ Params: DeleteAmbienteParams; Headers: { authorization?: string } }>,
      reply: FastifyReply,
    ) => {
      const mongoGetAmbienteRepository = new MongoGetAmbienteRepository();
      const mongoDeleteAmbienteRepository = new MongoDeleteAmbienteRepository();
      const deleteAmbienteController = new DeleteAmbienteController(
        mongoGetAmbienteRepository,
        mongoDeleteAmbienteRepository,
      );
      return deleteAmbienteController.handle(request, reply);
    },
  );
}
