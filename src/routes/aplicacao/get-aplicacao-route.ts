import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { GetAplicacaoController } from "../../controllers/aplicacao/get-aplicacap/get-aplicacao.js";
import type { GetAplicacaoParams } from "../../controllers/aplicacao/get-aplicacap/types.js";
import { MongoGetAplicacaoRepository } from "../../repositories/aplicacacao/get-aplicacao/mongo-get-aplicacao.js";
import type { FastifyTypedInstance } from "../../types.js";

export function getAplicacaoRoute(app: FastifyTypedInstance) {
  app.get(
    "/aplicacao/:idAplicacao",
    {
      schema: {
        tags: ["Aplicação"],
        description: "Obtém uma aplicação",
        params: z.object({
          idAplicacao: z.string(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            usuario: z.string(),
            senha: z.string(),
            status: z.string(),
            dados: z.object({
              nome: z.string(),
              tipoPessoa: z.string(),
              cpfCnpj: z.string(),
              email: z.string(),
              telefone: z.string(),
              endereco: z.object({
                endereco: z.string(),
                numero: z.string(),
                bairro: z.string(),
                complemento: z.string(),
                cep: z.string(),
                uf: z.string(),
                cidade: z.string(),
              }),
            }),
            criadoEm: z.string(),
            atualizadoEm: z.string(),
          }),
          404: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("Aplicação não encontrada"),
          400: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("Requisição malformatada"),
        },
      },
    },
    (request: FastifyRequest<{ Params: GetAplicacaoParams }>, reply: FastifyReply) => {
      const mongoGetAplicacaoRepository = new MongoGetAplicacaoRepository();
      const getAplicacaoController = new GetAplicacaoController(mongoGetAplicacaoRepository);
      return getAplicacaoController.handle(request, reply);
    },
  );
}
