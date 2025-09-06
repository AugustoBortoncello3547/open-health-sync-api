import type { RoleApiEnum } from "../../enums/role-api-enum";

export interface IJwtTokenController {
  getTokenFromAuthorizationHeader(authHeader?: string): TResponseGTetTokenFromAuthorizationHeader;
  extractDatafromToken(token: string): Promise<TJwtProps>;
  getTokenData(authHeader: string): Promise<TJwtProps>;
}

export type TResponseGTetTokenFromAuthorizationHeader = {
  scheme: string;
  token: string;
};

export type TJwtProps = {
  idAplicacao: string;
  email: string;
  role: RoleApiEnum | "";
};
