export class ValidationError extends Error {
  constructor(readonly expected: string, readonly actual: string) {
    super(`Expected <${expected}> to equal <${actual}>`)
  }
}
