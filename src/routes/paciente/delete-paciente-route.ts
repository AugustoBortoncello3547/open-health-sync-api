import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { DeletePacienteController } from "../../controllers/paciente/delete-paciente.ts/delete-paciente.js";
import type { TDeletePacienteParams } from "../../controllers/paciente/delete-paciente.ts/types.js";
import { HttpStatusCodeEnum } from "../../enums/http-status-code-enum.js";
import { authHook } from "../../hooks/auth-hook.js";
import type { FastifyTypedInstance } from "../../types.js";

export function deletePacienteRoute(app: FastifyTypedInstance) {
  app.delete(
    "/ambiente/:idAmbiente/paciente/:idPaciente",
    {
      schema: {
        tags: ["Paciente"],
        description: "Deleta um paciente.",
        security: [{ bearerAuth: [] }],
        headers: z.object({
          authorization: z.string().optional(),
        }),
        params: z.object({
          idAmbiente: z.string().describe("Identificador do ambiente onde o paciente será excluído."),
          idPaciente: z.string().describe("Identificador do paciente, podendo ser o id interno ou o idExterno."),
        }),
        response: {
          200: z.null().describe("Paciente deletado com sucesso."),
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
          403: z
            .object({
              error: z.string(),
              message: z.string().describe("Mensagem contendo qual recurso está sem permissão/condição de uso."),
            })
            .describe("Recurso existe, porém sem permissão/condição de usa-ló."),
          404: z
            .object({
              error: z.string(),
              message: z.string().describe("Mensagem contendo qual recurso que não foi encontrado."),
            })
            .describe("Recurso não encontrado"),
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
      request: FastifyRequest<{ Params: TDeletePacienteParams; Headers: { authorization?: string } }>,
      reply: FastifyReply,
    ) => {
      const authHeader = request.headers.authorization;
      const { idAmbiente, idPaciente } = request.params;

      const deletePacienteController = new DeletePacienteController();
      await deletePacienteController.handle(idAmbiente, idPaciente, authHeader);

      reply.status(HttpStatusCodeEnum.NO_CONTENT);
    },
  );
}
