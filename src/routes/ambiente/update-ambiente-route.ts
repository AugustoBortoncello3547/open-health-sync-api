import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import type {
  TUpdateAmbienteParams,
  TUpdateAmbienteRequest,
} from "../../controllers/ambiente/update-ambiente/types.js";
import { UpdateAmbienteController } from "../../controllers/ambiente/update-ambiente/update-ambiente.js";
import { HttpStatusCodeEnum } from "../../enums/http-status-code-enum.js";
import { authHook } from "../../hooks/auth-hook.js";
import type { FastifyTypedInstance } from "../../types.js";
import { StatusAmbienteEnum } from "../../enums/ambiente/status-ambiente-enum.js";

export async function updateAmbienteRoute(app: FastifyTypedInstance) {
  app.put(
    "/ambiente/:idAmbiente",
    {
      schema: {
        tags: ["Ambiente"],
        description: "Atualizar ambiente",
        security: [{ bearerAuth: [] }],
        params: z.object({
          idAmbiente: z.string(),
        }),
        body: z.object({
          idExterno: z.string().optional(),
          nome: z.string().optional(),
          status: z.enum(StatusAmbienteEnum).optional(),
          urlWebhook: z.string().optional(),
          tokenWebhook: z.string().optional(),
        }),
        response: {
          200: z
            .object({ id: z.string().describe("O id do ambiente atualizada.") })
            .describe("Ambiente atualizado com sucesso!"),
          400: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("A requisição não pôde ser processada devido a dados inválidos ou formato incorreto do payload."),
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
      request: FastifyRequest<{
        Body: TUpdateAmbienteRequest;
        Params: TUpdateAmbienteParams;
        Headers: { authorization?: string };
      }>,
      reply: FastifyReply,
    ) => {
      const authHeader = request.headers.authorization;
      const updateAplicacacaoRequest = request.body;
      const { idAmbiente } = request.params;

      const updateAmbienteController = new UpdateAmbienteController();
      const id = await updateAmbienteController.handle(idAmbiente, updateAplicacacaoRequest, authHeader);

      reply.status(HttpStatusCodeEnum.OK).send({ id });
    },
  );
}
