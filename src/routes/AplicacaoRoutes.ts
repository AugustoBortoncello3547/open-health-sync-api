import type { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import z from "zod";
import { StatusAplicacaoEnum } from "../Enums/Aplicacao/StatusAplicacaoEnum.js";
import { tipoPessoaEnum } from "../Enums/Aplicacao/TipoPessoaEnum.js";
import { ufEnum } from "../Enums/Aplicacao/UfEnum.js";
import type { FastifyTypedInstance } from "../types.js";

const aplicacoes: Record<string, AplicacaoType> = {};

type AplicacaoType = z.infer<typeof aplicacaoSchema> & {
  id: string;
};

const aplicacaoSchema = z.object({
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
});

type GetAplicacaoParams = {
  idAplicacao: string; //
};

export async function aplicacaoRoutes(app: FastifyTypedInstance) {
  app.post(
    "/aplicacao",
    {
      schema: {
        tags: ["Aplicação"],
        description: "Criar nova aplicação",
        body: aplicacaoSchema,
        response: {
          201: z.string().describe("Aplicação criada com sucesso!"),
        },
      },
    },
    (request, reply) => {
      const aplicacao = request.body;

      const id = randomUUID();
      aplicacoes[id] = {
        id: id,
        ...aplicacao,
      };

      reply.status(201).send(id);
    },
  );

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
          200: aplicacaoSchema.extend({
            id: z.string(),
          }),
          400: z.string().describe("Aplicação não encontrada"),
        },
      },
    },
    (request: FastifyRequest<{ Params: GetAplicacaoParams }>, reply: FastifyReply) => {
      const { idAplicacao } = request.params;

      const aplicacao = aplicacoes[idAplicacao];
      if (!aplicacao) {
        reply.status(400);
      }

      reply.status(200).send(aplicacao);
    },
  );
}
