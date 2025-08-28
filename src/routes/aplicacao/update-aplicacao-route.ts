import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import type { TUpdateAplicacao, TUpdateAplicacaoParams } from "../../controllers/aplicacao/update-aplicacao/types.js";
import { UpdateAplicacaoController } from "../../controllers/aplicacao/update-aplicacao/update-aplicacao.js";
import { StatusAplicacaoEnum } from "../../enums/aplicacao/status-aplicacao-enum.js";
import { tipoPessoaEnum } from "../../enums/tipo-pessoa-enum.js";
import { ufEnum } from "../../enums/uf-enum.js";
import { MongoGetAplicacaoRepository } from "../../repositories/aplicacacao/get-aplicacao/mongo-get-aplicacao.js";
import { MongoUpdateAplicacaoRepository } from "../../repositories/aplicacacao/update-aplicacao/mongo-update-aplicacao.js";
import type { FastifyTypedInstance } from "../../types.js";

export async function updateAplicacaoRoute(app: FastifyTypedInstance) {
  app.put(
    "/aplicacao/:idAplicacao",
    {
      schema: {
        tags: ["Aplicação"],
        description: "Atualizar aplicação",
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
    },
    (request: FastifyRequest<{ Body: TUpdateAplicacao; Params: TUpdateAplicacaoParams }>, reply: FastifyReply) => {
      const mongoUpdateAplicacaoRepository = new MongoUpdateAplicacaoRepository();
      const mongoGetAplicacaoRepository = new MongoGetAplicacaoRepository();
      const updateAplicacaoController = new UpdateAplicacaoController(
        mongoGetAplicacaoRepository,
        mongoUpdateAplicacaoRepository,
      );
      return updateAplicacaoController.handle(request, reply);
    },
  );
}
