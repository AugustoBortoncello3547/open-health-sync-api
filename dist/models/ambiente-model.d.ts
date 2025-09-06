import { Schema } from "mongoose";
import type { TAmbienteSchema } from "../controllers/ambiente/types";
import { StatusAmbienteEnum } from "../enums/ambiente/status-ambiente-enum";
export declare const AmbienteModel: import("mongoose").Model<TAmbienteSchema, {}, {}, {}, import("mongoose").Document<unknown, {}, TAmbienteSchema, {}, {}> & {
    idExterno: string;
    idAplicacao: string;
    nome: string;
    status: StatusAmbienteEnum;
    apiKey: string;
    urlWebhook: string;
    tokenWebhook: string;
} & import("mongoose").Document<Schema.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ambiente-model.d.ts.map