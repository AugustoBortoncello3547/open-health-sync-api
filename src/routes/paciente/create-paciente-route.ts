import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { CreatePacienteController } from "../../controllers/paciente/create-paciente/create-paciente.js";
import type { TCreatePacienteRequest } from "../../controllers/paciente/create-paciente/types.js";
import { HttpStatusCodeEnum } from "../../enums/http-status-code-enum.js";
import { authHook } from "../../hooks/auth-hook.js";
import type { FastifyTypedInstance } from "../../types.js";

export async function createPacienteRoute(app: FastifyTypedInstance) {
  app.post(
    "/paciente",
    {
      schema: {
        tags: ["Paciente"],
        description: "Criar novo paciente.",
        security: [{ bearerAuth: [] }],
        headers: z.object({
          authorization: z.string().optional(),
        }),
        body: z.object({
          idExterno: z.string().optional().describe("Identificador externo do paciente, definido pelo cliente."),
          dados: z.looseObject({}).describe("Os dados do paciente. Pode ser um objeto com multiplos níveis."),
        }),
        response: {
          201: z
            .object({ id: z.string().describe("O id do paciente gerado pela API.") })
            .describe("Paciente criado com sucesso."),
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
      preHandler: authHook,
    },
    async (
      request: FastifyRequest<{ Body: TCreatePacienteRequest; Headers: { authorization?: string } }>,
      reply: FastifyReply,
    ) => {
      const authHeader = request.headers.authorization;
      const createPacienteRequest = request.body;

      const createPacienteController = new CreatePacienteController();
      const id = await createPacienteController.handle(createPacienteRequest, authHeader);

      reply.status(HttpStatusCodeEnum.CREATED).send({ id });
    },
  );
}
