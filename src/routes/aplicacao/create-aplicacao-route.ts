import { randomUUID } from "node:crypto";
import z from "zod";
import { StatusAplicacaoEnum } from "../../enums/aplicacao/status-aplicacao-enum.js";
import { tipoPessoaEnum } from "../../enums/tipo-pessoa-enum.js";
import { ufEnum } from "../../enums/uf-enum.js";
import type { FastifyTypedInstance } from "../../types.js";
import { MongoCreateAplicacaoRepository } from "../../repositories/aplicacacao/create-aplicacao/mongo-create-aplicacao.js";
import { CreateAplicacaoController } from "../../controllers/aplicacao/create-aplicacao/create-aplicacao.js";
import type { CreateAplicacaoParams } from "../../controllers/aplicacao/create-aplicacao/types.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function createAplicacaoRoute(app: FastifyTypedInstance) {
  app.post(
    "/aplicacao",
    {
      schema: {
        tags: ["Aplicação"],
        description: "Criar nova aplicação",
        body: z.object({
          usuario: z.string(),
          senha: z
            .string()
            .min(8, { message: "A senha deve conter no mínimo 8 caracteres" })
            .max(16, "A senha deve conter no mínimo 16 caracteres"),
          status: z.enum(StatusAplicacaoEnum),
          dados: z.object({
            nome: z.string(),
            tipoPessoa: z.enum(tipoPessoaEnum),
            cpfCnpj: z.string(),
            email: z.string().email(),
            telefone: z.string(),
            endereco: z.object({
              endereco: z.string(),
              numero: z.string(),
              bairro: z.string(),
              complemento: z.string(),
              cep: z.string(),
              uf: z.enum(ufEnum),
              cidade: z.string(),
            }),
          }),
        }),
        response: {
          201: z.object({ id: z.string() }).describe("Aplicação criada com sucesso!"),
          500: z.object({ message: z.string() }).describe("Erro Interno no servidor"),
        },
      },
    },
    (request: FastifyRequest<{ Body: CreateAplicacaoParams }>, reply: FastifyReply) => {
      const mongoCreateAplicacaoRepository = new MongoCreateAplicacaoRepository();
      const createAplicacaoController = new CreateAplicacaoController(mongoCreateAplicacaoRepository);
      createAplicacaoController.handle(request, reply);
    },
  );
}
