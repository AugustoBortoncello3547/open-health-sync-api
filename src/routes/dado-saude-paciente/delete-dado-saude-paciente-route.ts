import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { DeleteDadoSaudePacienteController } from "../../controllers/dado-saude-paciente/delete-dado-saude-paciente/delete-dado-saude-paciente.js";
import type { TDeleteDadoSaudePacienteParams } from "../../controllers/dado-saude-paciente/delete-dado-saude-paciente/types.js";
import { HttpStatusCodeEnum } from "../../enums/http-status-code-enum.js";
import { authHook } from "../../hooks/auth-hook.js";
import type { FastifyTypedInstance } from "../../types.js";

export function deleteDadoSaudePacienteRoute(app: FastifyTypedInstance) {
  app.delete(
    "/paciente/:idPaciente/registro/:idRegistro",
    {
      schema: {
        tags: ["Registro de saúde do paciente"],
        description: "Deleta registro de saúde do paciente.",
        security: [{ bearerAuth: [] }],
        headers: z.object({
          authorization: z.string().optional(),
        }),
        params: z.object({
          idPaciente: z.string().describe("Identificador do paciente, podendo ser o id interno ou o idExterno."),
          idRegistro: z.string().describe("Identificador do dado de saúde do paciente que será excluído."),
        }),
        response: {
          200: z.null().describe("Dado de saúde do paciente deletado com sucesso."),
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
      request: FastifyRequest<{ Params: TDeleteDadoSaudePacienteParams; Headers: { authorization?: string } }>,
      reply: FastifyReply,
    ) => {
      const authHeader = request.headers.authorization;
      const { idRegistro, idPaciente } = request.params;

      const deleteDadoSaudePacienteController = new DeleteDadoSaudePacienteController();
      await deleteDadoSaudePacienteController.handle(idRegistro, idPaciente, authHeader);

      reply.status(HttpStatusCodeEnum.NO_CONTENT);
    },
  );
}
