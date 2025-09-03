import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { CreateAplicacaoController } from "../../controllers/aplicacao/create-aplicacao/create-aplicacao.js";
import type { TCreateAplicacaoParams } from "../../controllers/aplicacao/create-aplicacao/types.js";
import { tipoPessoaEnum } from "../../enums/tipo-pessoa-enum.js";
import { ufEnum } from "../../enums/uf-enum.js";
import { adminAuthHook } from "../../hooks/admin-auth-hook.js";
import type { FastifyTypedInstance } from "../../types.js";

export async function createAplicacaoRoute(app: FastifyTypedInstance) {
  app.post(
    "/aplicacao",
    {
      schema: {
        tags: ["Aplicação"],
        description: "Criar nova aplicação",
        security: [{ bearerAuth: [] }],
        body: z.object({
          email: z
            .email("O e-mail informado não é válido.")
            .describe("O email para contato da aplicação. Deve ser único na API."),
          senha: z
            .string("A senha é obrigatória.")
            .min(8, { message: "A senha deve conter no mínimo 8 caracteres." })
            .max(16, { message: "A senha deve conter no máximo 16 caracteres." })
            .describe(
              "A senha da aplicação, para ser usada postiormente na obtenção do token para a autenticação da API.",
            ),
          dados: z.object({
            nome: z.string("O nome é obrigatório.").describe("O nome da aplicação."),
            tipoPessoa: z
              .enum(tipoPessoaEnum, "O tipo de pessoa é obrigatório.")
              .describe("O tipo de pessoa da aplicação."),
            cpfCnpj: z
              .string("O CPF/CNPJ é obrigatório")
              .describe("O CPF/CNPJ da aplicação. Será validado conforme o tipo da pessoa informada."),
            telefone: z.string().optional().describe("O telefone da aplicação."),
            endereco: z
              .object({
                endereco: z.string().optional().describe("O endereço da aplicação."),
                numero: z.string().optional().describe("O numero do endereço da aplicação."),
                bairro: z.string().optional().describe("O bairro da aplicação."),
                complemento: z.string().optional().describe("O complemento do endereço da aplicação."),
                cep: z.string("O CEP é obrigatório.").describe("O CEP da aplicação."),
                uf: z.enum(ufEnum, "O UF é obrigatório.").describe("O estado da aplicação."),
                cidade: z.string("A cidade é obrigatória.").describe("A cidade do endereço da aplicação."),
              })
              .describe("Os dados para o endereço da aplicação."),
          }),
        }),
        response: {
          201: z
            .object({ id: z.string().describe("O id da aplicação gerado pela API.") })
            .describe("Aplicação criada com sucesso!"),
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
      preHandler: adminAuthHook,
    },
    (
      request: FastifyRequest<{ Body: TCreateAplicacaoParams; Headers: { authorization?: string } }>,
      reply: FastifyReply,
    ) => {
      const createAplicacaoController = new CreateAplicacaoController();
      return createAplicacaoController.handle(request, reply);
    },
  );
}
