export class ValidationGreaterThanError extends Error {
  constructor(readonly maximum: string, readonly actual: string) {
    super(`Expected <${actual}> to be less than <${maximum}>`)
  }
}
