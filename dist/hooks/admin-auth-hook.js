import { MongoGetAplicacaoRepository } from "../repositories/aplicacacao/get-aplicacao/mongo-get-aplicacao";
import { AuthApiController } from "../controllers/auth/auth-api-controller";
import { RoleApiEnum } from "../enums/role-api-enum";
export async function adminAuthHook(request, reply) {
    const mongoGetAplicacaoRepository = new MongoGetAplicacaoRepository();
    const authApiController = new AuthApiController(mongoGetAplicacaoRepository);
    return authApiController.verifyToken(request, reply, RoleApiEnum.ADMIN);
}
//# sourceMappingURL=admin-auth-hook.js.map