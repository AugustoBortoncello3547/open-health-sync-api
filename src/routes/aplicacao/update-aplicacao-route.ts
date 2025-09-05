import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import type {
  TUpdateAplicacaoParams,
  TUpdateAplicacaoRequest,
} from "../../controllers/aplicacao/update-aplicacao/types";
import { UpdateAplicacaoController } from "../../controllers/aplicacao/update-aplicacao/update-aplicacao";
import { StatusAplicacaoEnum } from "../../enums/aplicacao/status-aplicacao-enum";
import { HttpStatusCodeEnum } from "../../enums/http-status-code-enum";
import { tipoPessoaEnum } from "../../enums/tipo-pessoa-enum";
import { ufEnum } from "../../enums/uf-enum";
import { adminAuthHook } from "../../hooks/admin-auth-hook";
import type { FastifyTypedInstance } from "../../types";

export async function updateAplicacaoRoute(app: FastifyTypedInstance) {
  app.put(
    "/aplicacao/:idAplicacao",
    {
      schema: {
        tags: ["Aplicação"],
        description: "Atualizar aplicação",
        security: [{ bearerAuth: [] }],
        params: z.object({
          idAplicacao: z.string(),
        }),
        body: z.object({
          email: z.email().optional(),
          status: z.enum(StatusAplicacaoEnum).optional(),
          dados: z
            .object({
              nome: z.string().optional(),
              tipoPessoa: z.enum(tipoPessoaEnum).optional(),
              telefone: z.string().optional(),
              endereco: z
                .object({
                  endereco: z.string().optional(),
                  numero: z.string().optional(),
                  bairro: z.string().optional(),
                  complemento: z.string().optional(),
                  cep: z.string().optional(),
                  uf: z.enum(ufEnum).optional(),
                  cidade: z.string().optional(),
                })
                .optional(),
            })
            .optional(),
        }),
        response: {
          200: z
            .object({ id: z.string().describe("O id da aplicação atualizada.") })
            .describe("Aplicação atualizada com sucesso!"),
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
      preHandler: adminAuthHook,
    },
    async (
      request: FastifyRequest<{
        Body: TUpdateAplicacaoRequest;
        Params: TUpdateAplicacaoParams;
        Headers: { authorization?: string };
      }>,
      reply: FastifyReply,
    ) => {
      const updateAplicacacaoRequest = request.body;
      const { idAplicacao } = request.params;

      const updateAplicacaoController = new UpdateAplicacaoController();
      const id = await updateAplicacaoController.handle(idAplicacao, updateAplicacacaoRequest);

      reply.status(HttpStatusCodeEnum.OK).send({ id });
    },
  );
}
