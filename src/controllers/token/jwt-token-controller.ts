import jwt from "jsonwebtoken";
import type { IJwtTokenController, TJwtProps, TResponseGTetTokenFromAuthorizationHeader } from "./types.js";

export class JwtTokenController implements IJwtTokenController {
  getTokenFromAuthorizationHeader(authHeader?: string): TResponseGTetTokenFromAuthorizationHeader {
    let parsedAuthHeader = authHeader ?? "";

    const [scheme, token] = parsedAuthHeader.split(" ");
    return {
      scheme: scheme ?? "",
      token: token ?? "",
    };
  }

  async extractDatafromToken(token: string): Promise<TJwtProps> {
    try {
      const secretJWT = process.env.JWT_SECRET || "";
      return (await jwt.verify(token, secretJWT)) as TJwtProps;
    } catch {
      return {
        idAplicacao: "",
        email: "",
        role: "",
      };
    }
  }

  /**
   * Extrai os dados do token JWT a partir do cabeçalho de autorização.
   * Em rotas protegidas, os dados retornados do token, são sempre 100% válidos
   */
  async getTokenData(authHeader?: string): Promise<TJwtProps> {
    const { token } = this.getTokenFromAuthorizationHeader(authHeader);
    return await this.extractDatafromToken(token);
  }
}
