import { Schema } from "mongoose";
import type { TAplicacaoSchema } from "../controllers/aplicacao/types";
import { StatusAplicacaoEnum } from "../enums/aplicacao/status-aplicacao-enum";
import { tipoPessoaEnum } from "../enums/tipo-pessoa-enum";
import { ufEnum } from "../enums/uf-enum";
export declare const AplicacaoModel: import("mongoose").Model<TAplicacaoSchema, {}, {}, {}, import("mongoose").Document<unknown, {}, TAplicacaoSchema, {}, {}> & {
    status: StatusAplicacaoEnum;
    email: string;
    senha: string;
    dados: {
        nome: string;
        tipoPessoa: tipoPessoaEnum;
        cpfCnpj: string;
        telefone: string;
        endereco: {
            endereco: string;
            numero: string;
            bairro: string;
            complemento: string;
            cep: string;
            uf: ufEnum;
            cidade: string;
        };
    };
} & import("mongoose").Document<Schema.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=aplicacao-model.d.ts.map