import jwt from "jsonwebtoken";
export class JwtTokenController {
    getTokenFromAuthorizationHeader(authHeader) {
        let parsedAuthHeader = authHeader ?? "";
        const [scheme, token] = parsedAuthHeader.split(" ");
        return {
            scheme: scheme ?? "",
            token: token ?? "",
        };
    }
    async extractDatafromToken(token) {
        try {
            const secretJWT = process.env.JWT_SECRET || "";
            return (await jwt.verify(token, secretJWT));
        }
        catch {
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
    async getTokenData(authHeader) {
        const { token } = this.getTokenFromAuthorizationHeader(authHeader);
        return await this.extractDatafromToken(token);
    }
}
//# sourceMappingURL=jwt-token-controller.js.map