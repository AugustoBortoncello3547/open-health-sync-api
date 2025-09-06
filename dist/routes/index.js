import { createAmbienteRoute } from "./ambiente/create-ambiente-route";
import { deleteAmbienteRoute } from "./ambiente/delete-ambiente-route";
import { getAmbienteRoute } from "./ambiente/get-ambiente-route";
import { createAplicacaoRoute } from "./aplicacao/create-aplicacao-route";
import { getAplicacaoRoute } from "./aplicacao/get-aplicacao-route";
import { updateAplicacaoRoute } from "./aplicacao/update-aplicacao-route";
import { authRoute } from "./auth/auth-route";
import { listAmbienteRoute } from "./ambiente/list-ambiente-route";
export function registerRoutes(app) {
    // Aplicacao
    app.register(createAplicacaoRoute);
    app.register(getAplicacaoRoute);
    app.register(updateAplicacaoRoute);
    // Auth
    app.register(authRoute);
    // Ambiente
    app.register(createAmbienteRoute);
    app.register(listAmbienteRoute);
    app.register(getAmbienteRoute);
    app.register(deleteAmbienteRoute);
}
//# sourceMappingURL=index.js.map