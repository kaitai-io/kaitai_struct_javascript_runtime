export class EOFError extends Error {
  constructor(readonly requestedBytes: number, readonly availableBytes: number) {
    super(`Requested <${requestedBytes}> bytes, but only <${availableBytes}> bytes available`)
  }
}
