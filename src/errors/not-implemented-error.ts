export class NotImplementedError extends Error {
  constructor(message: string) {
    super(`Not implemented: ${message}`)
  }
}
