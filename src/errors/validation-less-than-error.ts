export class ValidationLessThanError extends Error {
  constructor(readonly minimum: string, readonly actual: string) {
    super(`Expected <${actual}> to be greater than <${minimum}>`)
  }
}
