import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { GetAplicacaoController } from "../../controllers/aplicacao/get-aplicacao/get-aplicacao.js";
import type { GetAplicacaoParams } from "../../controllers/aplicacao/get-aplicacao/types.js";
import { StatusAplicacaoEnum } from "../../enums/aplicacao/status-aplicacao-enum.js";
import { HttpStatusCodeEnum } from "../../enums/http-status-code-enum.js";
import { adminAuthHook } from "../../hooks/admin-auth-hook.js";
import type { FastifyTypedInstance } from "../../types.js";

export function getAplicacaoRoute(app: FastifyTypedInstance) {
  app.get(
    "/aplicacao/:idAplicacao",
    {
      schema: {
        tags: ["Aplicação"],
        description: "Obtém uma aplicação",
        security: [{ bearerAuth: [] }],
        params: z.object({
          idAplicacao: z.string().describe("O id da aplicação."),
        }),
        response: {
          200: z
            .object({
              id: z.string().describe("O id da aplicação."),
              email: z.string().describe("O email únicao da aplicação."),
              status: z.enum(StatusAplicacaoEnum).describe("O status da aplicação."),
              dados: z
                .object({
                  nome: z.string().describe("O nome da aplicação."),
                  tipoPessoa: z.string().describe("O tipo da pessoa da aplicação."),
                  cpfCnpj: z.string().describe("O CPF ou CNPJ da aplicação dependendo do tipo da pessoa."),
                  telefone: z.string().describe("O telefone da aplicação."),
                  endereco: z
                    .object({
                      endereco: z.string().describe("O endereço da aplicação."),
                      numero: z.string().describe("O numero do endereço da aplicação."),
                      bairro: z.string().describe("O bairro da aplicação."),
                      complemento: z.string().describe("O complemento do endereço da aplicação."),
                      cep: z.string().describe("O CEP da aplicação."),
                      uf: z.string().describe("O estado da aplicação."),
                      cidade: z.string().describe("A cidade do endereço da aplicação."),
                    })
                    .describe("Os dados do endereço da aplicação."),
                })
                .describe("Os dados gerais da aplicação."),
              atualizadoEm: z.string().describe("Data e hora da última atualização do ambiente."),
              criadoEm: z.string().describe("Data e hora de criação do ambiente."),
            })
            .describe("Aplicação encontrada."),
          400: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("Requisição malformatada"),
          404: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("Aplicação não encontrado"),
          500: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("Erro interno do servidor. Algo inesperado ocorreu ao processar a requisição."),
        },
      },
      // preHandler: adminAuthHook,
    },
    async (
      request: FastifyRequest<{ Params: GetAplicacaoParams; Headers: { authorization?: string } }>,
      reply: FastifyReply,
    ) => {
      const { idAplicacao } = request.params;

      const getAplicacaoController = new GetAplicacaoController();
      const aplicacao = await getAplicacaoController.handle(idAplicacao);

      reply.status(HttpStatusCodeEnum.OK).send(aplicacao);
    },
  );
}
