import { compare } from "bcrypt";
import {} from "fastify";
import jwt from "jsonwebtoken";
import { BLOCKED_STATUS } from "../../enums/aplicacao/status-aplicacao-enum";
import { RoleApiEnum } from "../../enums/role-api-enum";
import { UnauthorizedError } from "../../errors/unauthorized-error";
import { MongoGetAplicacaoRepository } from "../../repositories/aplicacacao/get-aplicacao/mongo-get-aplicacao";
import { JwtTokenController } from "../token/jwt-token-controller";
export class AuthApiController {
    getAplicacaoRepository;
    constructor(getAplicacaoRepository = new MongoGetAplicacaoRepository()) {
        this.getAplicacaoRepository = getAplicacaoRepository;
    }
    async autenticate(email, senha) {
        const aplicacao = await this.getAplicacaoRepository.getAplicacaoByEmail(email);
        if (!aplicacao) {
            throw new UnauthorizedError("Usuário ou senha inválidos.");
        }
        const { id: idAplicacao, senha: passwordHashed, email: emailAplicacao } = aplicacao;
        const passwordsAreIgual = await compare(senha, passwordHashed);
        if (!passwordsAreIgual) {
            throw new UnauthorizedError("Usuário ou senha inválidos.");
        }
        const idAplicacaoAdmin = process.env.ID_APLICACAO_ADMIN || "";
        const isAplicacaoAdminAuthenticating = idAplicacaoAdmin === idAplicacao;
        const jwtRole = isAplicacaoAdminAuthenticating ? RoleApiEnum.ADMIN : RoleApiEnum.USER;
        const secretJWT = process.env.JWT_SECRET || "";
        const expireTimeJWT = Number(process.env.JWT_EXPIRE_TIME) || 60;
        const jwtData = {
            idAplicacao,
            email: emailAplicacao,
            role: jwtRole,
        };
        const jwtToken = jwt.sign(jwtData, secretJWT, {
            expiresIn: `${expireTimeJWT}m`,
        });
        const expiresAt = new Date(Date.now() + expireTimeJWT * 60 * 1000);
        return {
            token: jwtToken,
            expiresIn: expireTimeJWT,
            expiresAt,
        };
    }
    async verifyToken(request, reply, roleToCheck) {
        const authHeader = request.headers.authorization;
        const jwtTokenController = new JwtTokenController();
        const { scheme, token } = jwtTokenController.getTokenFromAuthorizationHeader(authHeader);
        if (!scheme && !token) {
            throw new UnauthorizedError("Token não informado.");
        }
        if (scheme !== "Bearer" || !token) {
            throw new UnauthorizedError("Formato de token inválido.");
        }
        const { idAplicacao: idAplicacaoToken, email: emailAplicacaoToken, role, } = await jwtTokenController.extractDatafromToken(token);
        if (!idAplicacaoToken || !emailAplicacaoToken || !role) {
            throw new UnauthorizedError("Token fornecido não é valido.");
        }
        if (role !== roleToCheck) {
            throw new UnauthorizedError("Aplicação sem permissão para acessar o recurso.");
        }
        const aplicacacao = await this.getAplicacaoRepository.getAplicacao(idAplicacaoToken);
        if (!aplicacacao) {
            throw new UnauthorizedError("Aplicação não encotrada.");
        }
        if (BLOCKED_STATUS.includes(aplicacacao.status)) {
            throw new UnauthorizedError("Aplicação está bloqueada.");
        }
        if (aplicacacao.email !== emailAplicacaoToken) {
            throw new UnauthorizedError("Este Token não se refere ao email atual da aplicação.");
        }
    }
}
//# sourceMappingURL=auth-api-controller.js.map