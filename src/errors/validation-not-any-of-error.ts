export class ValidationNotAnyOfError extends Error {
  constructor(readonly expected: string[], readonly actual: string) {
    super(`Expected one of [${expected.join(", ")}], got "${actual}"`)
  }
}
