export class AplicacaoNaoEncontradaError extends Error {
  constructor() {
    super(`Aplicação não encontrada.`);
    this.name = "AplicacaoNaoEncontradaError";
  }
}
