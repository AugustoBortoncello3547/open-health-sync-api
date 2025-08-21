import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { CreateAplicacaoController } from "../../controllers/aplicacao/create-aplicacao/create-aplicacao.js";
import type { TCreateAplicacaoParams } from "../../controllers/aplicacao/create-aplicacao/types.js";
import { tipoPessoaEnum } from "../../enums/tipo-pessoa-enum.js";
import { ufEnum } from "../../enums/uf-enum.js";
import { MongoCreateAplicacaoRepository } from "../../repositories/aplicacacao/create-aplicacao/mongo-create-aplicacao.js";
import type { FastifyTypedInstance } from "../../types.js";
import { MongoGetAplicacaoRepository } from "../../repositories/aplicacacao/get-aplicacao/mongo-get-aplicacao.js";

export async function createAplicacaoRoute(app: FastifyTypedInstance) {
  app.post(
    "/aplicacao",
    {
      schema: {
        tags: ["Aplicação"],
        description: "Criar nova aplicação",
        body: z.object({
          email: z.email("O e-mail informado não é válido"),
          senha: z
            .string("A senha é obrigatória")
            .min(8, { message: "A senha deve conter no mínimo 8 caracteres" })
            .max(16, { message: "A senha deve conter no máximo 16 caracteres" }),
          dados: z.object({
            nome: z.string("O nome é obrigatório"),
            tipoPessoa: z.enum(tipoPessoaEnum, "O tipo de pessoa é obrigatório"),
            cpfCnpj: z.string("O CPF/CNPJ é obrigatório"),
            telefone: z.string().optional(),
            endereco: z.object({
              endereco: z.string().optional(),
              numero: z.string().optional(),
              bairro: z.string().optional(),
              complemento: z.string().optional(),
              cep: z.string("O CEP é obrigatório"),
              uf: z.enum(ufEnum, "O UF é obrigatório"),
              cidade: z.string("A cidade é obrigatória"),
            }),
          }),
        }),
        response: {
          201: z.object({ id: z.string() }).describe("Aplicação criada com sucesso!"),
          400: z.object({
            error: z.string().describe("Tipo do erro"),
            message: z.string().describe("Mensagem resumida do erro"),
            statusCode: z.number().describe("Código HTTP do erro").optional(),
            details: z
              .object({
                issues: z
                  .array(
                    z.object({
                      keyword: z.string().describe("Código do tipo de erro"),
                      instancePath: z.string().describe("Caminho do campo que falhou"),
                      schemaPath: z.string().describe("Caminho no schema que causou o erro"),
                      message: z.string().describe("Mensagem de validação"),
                    }),
                  )
                  .describe("Lista de erros de validação"),
                method: z.string().describe("Método HTTP da requisição"),
                url: z.string().describe("URL da requisição"),
              })
              .optional(),
          }),
          409: z.object({
            error: z.string().describe("Tipo do erro"),
            message: z.string().describe("Mensagem resumida e legível do erro"),
          }),
          500: z.object({ message: z.string() }).describe("Erro Interno no servidor"),
        },
      },
    },
    (request: FastifyRequest<{ Body: TCreateAplicacaoParams }>, reply: FastifyReply) => {
      const mongoCreateAplicacaoRepository = new MongoCreateAplicacaoRepository();
      const mongoGetAplicacaoRepository = new MongoGetAplicacaoRepository();
      const createAplicacaoController = new CreateAplicacaoController(
        mongoCreateAplicacaoRepository,
        mongoGetAplicacaoRepository,
      );
      return createAplicacaoController.handle(request, reply);
    },
  );
}
