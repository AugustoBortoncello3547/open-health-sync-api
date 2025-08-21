import z from "zod";
import type { FastifyTypedInstance } from "../../types.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { MongoGetAplicacaoRepository } from "../../repositories/aplicacacao/get-aplicacao/mongo-get-aplicacao.js";
import { AuthApiController } from "../../controllers/auth/auth-api-controller.js";
import type { AuthApiParams } from "../../controllers/auth/types.js";

export async function authRoute(app: FastifyTypedInstance) {
  app.post(
    "/auth",
    {
      schema: {
        tags: ["Autenticação"],
        description: "Autenticar na API",
        body: z.object({
          email: z.email("Email informado não é válido"),
          senha: z.string("A senha é obrigatória"),
        }),
        response: {
          200: z
            .object({
              token: z.string(),
              expiresIn: z.number().describe("Tempo de expiração em minutos!"),
              expiresAt: z.date(),
            })
            .describe("Autenticação realizada com sucesso!"),
          401: z
            .object({
              error: z.string(),
              message: z.string(),
            })
            .describe("Aplicação não autorizada"),
          500: z.object({ message: z.string() }).describe("Erro Interno no servidor"),
        },
      },
    },
    (request: FastifyRequest<{ Body: AuthApiParams }>, reply: FastifyReply) => {
      const mongoGetAplicacaoRepository = new MongoGetAplicacaoRepository();
      const authApiController = new AuthApiController(mongoGetAplicacaoRepository);
      return authApiController.autenticate(request, reply);
    },
  );
}
