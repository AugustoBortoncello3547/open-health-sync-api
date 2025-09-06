import { type FastifyReply, type FastifyRequest } from "fastify";
import { RoleApiEnum } from "../../enums/role-api-enum";
import type { IGetAplicacaoRepository } from "../aplicacao/get-aplicacao/types";
import type { IAuthAplicacaoController, TResponseAutenticate } from "./types";
export declare class AuthApiController implements IAuthAplicacaoController {
    private readonly getAplicacaoRepository;
    constructor(getAplicacaoRepository?: IGetAplicacaoRepository);
    autenticate(email: string, senha: string): Promise<TResponseAutenticate>;
    verifyToken(request: FastifyRequest<{
        Headers: {
            authorization?: string;
        };
    }>, reply: FastifyReply, roleToCheck: RoleApiEnum): Promise<void>;
}
//# sourceMappingURL=auth-api-controller.d.ts.map