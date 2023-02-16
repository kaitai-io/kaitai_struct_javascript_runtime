export class ValidationExpressionError extends Error {
  constructor(readonly expected: string, readonly actual: string) {
    super(`Expected <${expected}> to match <${actual}>`)
  }
}
