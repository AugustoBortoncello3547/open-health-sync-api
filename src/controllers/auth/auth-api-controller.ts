import { compare } from "bcrypt";
import { type FastifyReply, type FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "../../enums/http-status-code-enum.js";
import { UnauthorizedError } from "../../errors/unauthorized-error.js";
import type { IGetAplicaoRepository } from "../aplicacao/get-aplicacap/types.js";
import type { AuthApiParams, IAuthAplicaoController } from "./types.js";

export class AuthApiController implements IAuthAplicaoController {
  constructor(private readonly getAplicaoRepository: IGetAplicaoRepository) {}

  async autenticate(request: FastifyRequest<{ Body: AuthApiParams }>, reply: FastifyReply): Promise<void> {
    const { usuario, senha } = request.body;

    const aplicacao = await this.getAplicaoRepository.getAplicaoByUsuario(usuario);
    if (!aplicacao) {
      throw new UnauthorizedError("Usuário ou senha inválidos.");
    }
    const { id: idAplicacao, senha: passwordHashed, usuario: usernameAplicacao } = aplicacao;
    const passwordsAreIgual = await compare(senha, passwordHashed);
    if (!passwordsAreIgual) {
      throw new UnauthorizedError("Usuário ou senha inválidos.");
    }

    const secretJWT = process.env.JWT_SECRET || "";
    const expireTimeJWT = Number(process.env.JWT_EXPIRE_TIME) || 60;
    const jwtToken = jwt.sign({ idAplicacao, usuario: usernameAplicacao }, secretJWT, {
      expiresIn: `${expireTimeJWT}m`,
    });

    const expiresAt = new Date(Date.now() + expireTimeJWT * 60 * 1000);
    reply.status(HttpStatusCode.OK).send({
      token: jwtToken,
      expiresIn: expireTimeJWT,
      expiresAt,
    });
  }
}
