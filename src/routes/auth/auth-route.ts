import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { AuthApiController } from "../../controllers/auth/auth-api-controller.js";
import type { AuthApiParams } from "../../controllers/auth/types.js";
import type { FastifyTypedInstance } from "../../types.js";
import { HttpStatusCodeEnum } from "../../enums/http-status-code-enum.js";

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
    async (request: FastifyRequest<{ Body: AuthApiParams }>, reply: FastifyReply) => {
      const { email, senha } = request.body;

      const authApiController = new AuthApiController();
      const autenticateResponse = await authApiController.autenticate(email, senha);

      reply.status(HttpStatusCodeEnum.OK).send(autenticateResponse);
    },
  );
}
