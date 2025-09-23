import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { ListDadoSaudePacienteController } from "../../controllers/dado-saude-paciente/list-dado-saude-paciente/list-dado-saude-paciente.js";
import type { ListDadoSaudePacienteParams } from "../../controllers/dado-saude-paciente/list-dado-saude-paciente/types.js";
import type { TDadoSaudePacienteEndpoitsCommonParams } from "../../controllers/dado-saude-paciente/types.js";
import { HttpStatusCodeEnum } from "../../enums/http-status-code-enum.js";
import { TipoDataFiltroEnum } from "../../enums/tipo-data-filtro-enum.js";
import { authHook } from "../../hooks/auth-hook.js";
import type { FastifyTypedInstance } from "../../types.js";

export function listDadoSaudePacienteRoute(app: FastifyTypedInstance) {
  app.get(
    "/paciente/:idPaciente/registro",
    {
      schema: {
        tags: ["Registro de saúde do paciente"],
        description: "Lista os registros de saúde do paciente.",
        security: [{ bearerAuth: [] }],
        headers: z.object({
          authorization: z.string().optional(),
        }),
        params: z.object({
          idPaciente: z.string().describe("Identificador do paciente, podendo ser o id interno ou o idExterno."),
        }),
        querystring: z
          .object({
            tipoData: z.enum(TipoDataFiltroEnum).optional().describe("O tipo da data a ser considerada."),
            dataInicial: z
              .string()
              .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD.")
              .optional()
              .describe("Data inicial (YYYY-MM-DD)"),
            dataFinal: z
              .string()
              .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD.")
              .optional()
              .describe("Data final (YYYY-MM-DD)"),
            limit: z.number().int().positive().default(50).describe("Limite da paginação."),
            offset: z.number().int().min(0).default(0).describe("Offset da paginação."),
          })
          .superRefine((data, ctx) => {
            if (data.tipoData && !data.dataInicial && !data.dataFinal) {
              ctx.addIssue({
                path: ["tipoData"],
                code: z.ZodIssueCode.custom,
                message: "Se 'tipoData' for informado, informe 'dataInicial' ou 'dataFinal'.",
              });
            }

            if ((data.dataInicial || data.dataFinal) && !data.tipoData) {
              ctx.addIssue({
                path: ["tipoData"],
                code: z.ZodIssueCode.custom,
                message: "Se 'dataInicial' ou 'dataFinal' forem informadas, 'tipoData' é obrigatório.",
              });
            }

            if (data.dataInicial && data.dataFinal) {
              const ini = new Date(`${data.dataInicial}T00:00:00Z`);
              const fim = new Date(`${data.dataFinal}T23:59:59Z`);
              if (fim < ini) {
                ctx.addIssue({
                  path: ["dataFinal"],
                  code: z.ZodIssueCode.custom,
                  message: "'dataFinal' deve ser maior ou igual a 'dataInicial'.",
                });
              }
            }
          }),
        response: {
          200: z.object({
            registros: z.array(
              z.object({
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
            ),
            total: z.number(),
            limit: z.number(),
            offset: z.number(),
          }),
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
      request: FastifyRequest<{
        Params: TDadoSaudePacienteEndpoitsCommonParams;
        Querystring: ListDadoSaudePacienteParams;
        Headers: { authorization?: string };
      }>,
      reply: FastifyReply,
    ) => {
      const authHeader = request.headers.authorization;
      const listPacienteFilters = request.query;
      const { idPaciente } = request.params;

      const listDadoSaudePacienteController = new ListDadoSaudePacienteController();
      const listDadoSaudePacienteResponse = await listDadoSaudePacienteController.handle(
        idPaciente,
        listPacienteFilters,
        authHeader,
      );

      reply.status(HttpStatusCodeEnum.OK).send(listDadoSaudePacienteResponse);
    },
  );
}
