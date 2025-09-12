import type { TPaciente, TPacienteMongo } from "../../../controllers/paciente/index.js";
import type {
  IListPacienteRepository,
  ListPacienteParams,
  TQueryListPaciente,
} from "../../../controllers/paciente/list-paciente/types.js";
import { getMapFieldBD } from "../../../enums/tipo-data-filtro-enum.js";
import { PacienteModel } from "../../../models/paciente-model.js";

export class MongoListPacienteRepository implements IListPacienteRepository {
  async listPaciente(
    filters: Required<ListPacienteParams>,
    idAplicacao: string,
    idAmbiente: string,
  ): Promise<TPaciente[]> {
    const { tipoData, dataInicial, dataFinal, limit, offset } = filters;

    const query: TQueryListPaciente = { idAmbiente, idAplicacao };

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

    const pacientes = await PacienteModel.find(query).skip(offset).limit(limit).exec();

    return pacientes.map((item) => {
      const pacienteObj = item.toObject<TPacienteMongo>();
      const { _id, __v, ...rest } = pacienteObj;
      return {
        id: _id.toString(),
        ...rest,
      };
    });
  }
}
