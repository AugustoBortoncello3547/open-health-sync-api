import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { DeleteAmbienteController } from "../../controllers/ambiente/delete-ambiente/delete-ambiente";
import type { TDeleteAmbienteParams } from "../../controllers/ambiente/delete-ambiente/types";
import { HttpStatusCodeEnum } from "../../enums/http-status-code-enum";
import { authHook } from "../../hooks/auth-hook";
import type { FastifyTypedInstance } from "../../types";

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
          200: z.null().describe("Ambiente deletado com sucesso."),
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
    async (
      request: FastifyRequest<{ Params: TDeleteAmbienteParams; Headers: { authorization?: string } }>,
      reply: FastifyReply,
    ) => {
      const authHeader = request.headers.authorization;
      const { idAmbiente } = request.params;

      const deleteAmbienteController = new DeleteAmbienteController();
      await deleteAmbienteController.handle(idAmbiente, authHeader);

      reply.status(HttpStatusCodeEnum.NO_CONTENT);
    },
  );
}
