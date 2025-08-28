export enum StatusAplicacaoEnum {
  PENDENTE = "PENDENTE",
  ATIVADO = "ATIVADO",
  RECUSADO = "RECUSADO",
  CANCELADO = "CANCELADO",
  ATRASADO = "ATRASADO",
}

export const BLOCKED_STATUS = [StatusAplicacaoEnum.CANCELADO, StatusAplicacaoEnum.RECUSADO];
