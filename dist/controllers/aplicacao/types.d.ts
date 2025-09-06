import type { Document, ObjectId } from "mongoose";
import type { StatusAplicacaoEnum } from "../../enums/aplicacao/status-aplicacao-enum";
import type { tipoPessoaEnum } from "../../enums/tipo-pessoa-enum";
import type { ufEnum } from "../../enums/uf-enum";
export type TAplicacao = {
    id: string;
    email: string;
    senha: string;
    status: StatusAplicacaoEnum;
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
    criadoEm: Date;
    atualizadoEm: Date;
};
type TAplicacaoBase = Omit<TAplicacao, "id" | "atualizadoEm" | "criadoEm">;
export type TAplicacaoSchema = TAplicacaoBase & Document<ObjectId>;
export type TAplicacaoMongo = TAplicacaoBase & {
    _id: string;
    criadoEm: Date;
    atualizadoEm: Date;
};
export {};
//# sourceMappingURL=types.d.ts.map