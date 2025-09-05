import { compare } from "bcrypt";
import { type FastifyReply, type FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { BLOCKED_STATUS } from "../../enums/aplicacao/status-aplicacao-enum";
import { RoleApiEnum } from "../../enums/role-api-enum";
import { UnauthorizedError } from "../../errors/unauthorized-error";
import { MongoGetAplicacaoRepository } from "../../repositories/aplicacacao/get-aplicacao/mongo-get-aplicacao";
import type { IGetAplicacaoRepository } from "../aplicacao/get-aplicacao/types";
import { JwtTokenController } from "../token/jwt-token-controller";
import type { TJwtProps } from "../token/types";
import type { IAuthAplicacaoController, TResponseAutenticate } from "./types";

export class AuthApiController implements IAuthAplicacaoController {
  constructor(private readonly getAplicacaoRepository: IGetAplicacaoRepository = new MongoGetAplicacaoRepository()) {}

  async autenticate(email: string, senha: string): Promise<TResponseAutenticate> {
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
    const jwtData: TJwtProps = {
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

  async verifyToken(
    request: FastifyRequest<{ Headers: { authorization?: string } }>,
    reply: FastifyReply,
    roleToCheck: RoleApiEnum,
  ): Promise<void> {
    const authHeader = request.headers.authorization;
    const jwtTokenController = new JwtTokenController();
    const { scheme, token } = jwtTokenController.getTokenFromAuthorizationHeader(authHeader);

    if (!scheme && !token) {
      throw new UnauthorizedError("Token não informado.");
    }

    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedError("Formato de token inválido.");
    }

    const {
      idAplicacao: idAplicacaoToken,
      email: emailAplicacaoToken,
      role,
    } = await jwtTokenController.extractDatafromToken(token);
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
