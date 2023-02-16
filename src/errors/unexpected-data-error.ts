export class UnexpectedDataError extends Error {
  constructor(readonly expected: string, readonly actual: string) {
    super(`Expected <${expected}>, but got <${actual}>`)
  }
}
