import type {
  IListDadoSaudePacienteRepository,
  ListDadoSaudePacienteParams,
} from "../../../controllers/dado-saude-paciente/list-dado-saude-paciente/types.js";
import type { TDadoSaudePaciente, TDadoSaudePacienteMongo } from "../../../controllers/dado-saude-paciente/types.js";
import type { TQueryListPaciente } from "../../../controllers/paciente/list-paciente/types.js";
import { getMapFieldBD } from "../../../enums/tipo-data-filtro-enum.js";
import { DadoSaudePacienteModel } from "../../../models/dado-saude-paciente-model.js";

export class MongoListDadoSaudePacienteRepository implements IListDadoSaudePacienteRepository {
  async listDadoSaudePaciente(
    filters: Required<ListDadoSaudePacienteParams>,
    idAplicacao: string,
    idPaciente: string,
  ): Promise<TDadoSaudePaciente[]> {
    const { tipoData, dataInicial, dataFinal, limit, offset } = filters;

    const query: TQueryListPaciente = { idPaciente, idAplicacao };

    if (dataInicial || dataFinal) {
      const range: Record<string, Date> = {};

      if (dataInicial) {
        range.$gte = new Date(`${dataInicial}T00:00:00.000Z`);
      }

      if (dataFinal) {
        range.$lte = new Date(`${dataFinal}T23:59:59.999Z`);
      }

      const tipoDataParsed = getMapFieldBD(tipoData);
      query[tipoDataParsed] = range;
    }

    const dadoSaudePacientes = await DadoSaudePacienteModel.find(query).skip(offset).limit(limit).exec();

    return dadoSaudePacientes.map((item) => {
      const pacienteObj = item.toObject<TDadoSaudePacienteMongo>();
      const { _id, __v, ...rest } = pacienteObj;
      return {
        id: _id.toString(),
        ...rest,
      };
    });
  }
}
