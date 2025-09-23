import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { GetDadoSaudePacienteController } from "../../controllers/dado-saude-paciente/get-dado-saude-paciente/get-dado-saude-paciente.js";
import type { GetDadoSaudePacienteParams } from "../../controllers/dado-saude-paciente/get-dado-saude-paciente/types.js";
import { HttpStatusCodeEnum } from "../../enums/http-status-code-enum.js";
import { authHook } from "../../hooks/auth-hook.js";
import type { FastifyTypedInstance } from "../../types.js";

export function getDadoSaudePacienteRoute(app: FastifyTypedInstance) {
  app.get(
    "/paciente/:idPaciente/registro/:idRegistro",
    {
      schema: {
        tags: ["Registro de saúde do paciente"],
        description: "Obtém o registro de saúde do paciente.",
        security: [{ bearerAuth: [] }],
        headers: z.object({
          authorization: z.string().optional(),
        }),
        params: z.object({
          idPaciente: z.string().describe("Identificador do paciente, podendo ser o id interno ou o idExterno."),
          idRegistro: z.string().describe("Identificador do dado de saúde do paciente que será obtido."),
        }),
        response: {
          200: z.object({
            id: z.string().describe("Identificador interno do dado de saúde do paciente, gerado pelo sistema."),
            idExterno: z
              .string()
              .describe("Identificador externo do dado de saúde do paciente, definido pelo cliente na criação."),
            idPaciente: z.string().describe("Identificador interno do paciente"),
            dados: z
              .looseObject({})
              .describe(
                "Os dados do dado de saúde do paciente. Estes dados são retonados na mesma estrutura que foram cadastrados previamente.",
              ),
            atualizadoEm: z.string().describe("Data e hora da última atualização do dado de saúde."),
            criadoEm: z.string().describe("Data e hora de criação do dado de saúde."),
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
      request: FastifyRequest<{ Params: GetDadoSaudePacienteParams; Headers: { authorization?: string } }>,
      reply: FastifyReply,
    ) => {
      const authHeader = request.headers.authorization;
      const { idRegistro, idPaciente } = request.params;

      const getDadoSaudePacienteController = new GetDadoSaudePacienteController();
      const dadoSaudePaciente = await getDadoSaudePacienteController.handle(idRegistro, idPaciente, authHeader);

      reply.status(HttpStatusCodeEnum.OK).send(dadoSaudePaciente);
    },
  );
}
