export enum TipoDataFiltroEnum {
  DATA_ATUALIZACAO = "DATA_ATUALIZACAO",
  DATA_CRIACAO = "DATA_CRIACAO",
}

export function getMapFieldBD(tipoData: TipoDataFiltroEnum) {
  let map = {
    [TipoDataFiltroEnum.DATA_CRIACAO]: "criadoEm",
    [TipoDataFiltroEnum.DATA_ATUALIZACAO]: "atualizadoEm",
  };

  return map[tipoData] || "";
}
