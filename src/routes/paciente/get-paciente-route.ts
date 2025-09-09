import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { HttpStatusCodeEnum } from "../../enums/http-status-code-enum.js";
import { authHook } from "../../hooks/auth-hook.js";
import type { FastifyTypedInstance } from "../../types.js";
import { GetPacienteController } from "../../controllers/paciente/get-paciente/get-paciente.js";
import type { GetPacienteParams } from "../../controllers/paciente/get-paciente/types.js";

export function getPacienteRoute(app: FastifyTypedInstance) {
  app.get(
    "/paciente/:idPaciente",
    {
      schema: {
        tags: ["Paciente"],
        description: "Obtém um paciente.",
        security: [{ bearerAuth: [] }],
        headers: z.object({
          authorization: z.string().optional(),
        }),
        params: z.object({
          idPaciente: z.string().describe("Identificador do paciente, podendo ser o id interno ou o idExterno."),
        }),
        response: {
          200: z.object({
            id: z.string().describe("Identificador interno do paciente, gerado pelo sistema."),
            idExterno: z.string().describe("Identificador externo do paciente, definido pelo cliente na criação."),
            dados: z
              .looseObject({})
              .describe(
                "Os dados do paciente. Estes dados são retonados na mesma estrutura que foram cadastrados previamente.",
              ),
            atualizadoEm: z.string().describe("Data e hora da última atualização do paciente."),
            criadoEm: z.string().describe("Data e hora de criação do paciente."),
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
            .describe("Paciente não encontrado"),
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
      request: FastifyRequest<{ Params: GetPacienteParams; Headers: { authorization?: string } }>,
      reply: FastifyReply,
    ) => {
      const authHeader = request.headers.authorization;
      const { idPaciente } = request.params;

      const getPacienteController = new GetPacienteController();
      const paciente = await getPacienteController.handle(idPaciente, authHeader);

      reply.status(HttpStatusCodeEnum.OK).send(paciente);
    },
  );
}
