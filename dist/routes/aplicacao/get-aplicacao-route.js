import z from "zod";
import { GetAplicacaoController } from "../../controllers/aplicacao/get-aplicacao/get-aplicacao";
import { StatusAplicacaoEnum } from "../../enums/aplicacao/status-aplicacao-enum";
import { HttpStatusCodeEnum } from "../../enums/http-status-code-enum";
import { adminAuthHook } from "../../hooks/admin-auth-hook";
export function getAplicacaoRoute(app) {
    app.get("/aplicacao/:idAplicacao", {
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
        preHandler: adminAuthHook,
    }, async (request, reply) => {
        const { idAplicacao } = request.params;
        const getAplicacaoController = new GetAplicacaoController();
        const aplicacao = await getAplicacaoController.handle(idAplicacao);
        reply.status(HttpStatusCodeEnum.OK).send(aplicacao);
    });
}
//# sourceMappingURL=get-aplicacao-route.js.map