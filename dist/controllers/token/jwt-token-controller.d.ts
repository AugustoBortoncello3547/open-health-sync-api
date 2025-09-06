import type { IJwtTokenController, TJwtProps, TResponseGTetTokenFromAuthorizationHeader } from "./types";
export declare class JwtTokenController implements IJwtTokenController {
    getTokenFromAuthorizationHeader(authHeader?: string): TResponseGTetTokenFromAuthorizationHeader;
    extractDatafromToken(token: string): Promise<TJwtProps>;
    /**
     * Extrai os dados do token JWT a partir do cabeçalho de autorização.
     * Em rotas protegidas, os dados retornados do token, são sempre 100% válidos
     */
    getTokenData(authHeader?: string): Promise<TJwtProps>;
}
//# sourceMappingURL=jwt-token-controller.d.ts.map