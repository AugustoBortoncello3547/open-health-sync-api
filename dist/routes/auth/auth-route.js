import z from "zod";
import { AuthApiController } from "../../controllers/auth/auth-api-controller";
import { HttpStatusCodeEnum } from "../../enums/http-status-code-enum";
export async function authRoute(app) {
    app.post("/auth", {
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
    }, async (request, reply) => {
        const { email, senha } = request.body;
        const authApiController = new AuthApiController();
        const autenticateResponse = await authApiController.autenticate(email, senha);
        reply.status(HttpStatusCodeEnum.OK).send(autenticateResponse);
    });
}
//# sourceMappingURL=auth-route.js.map