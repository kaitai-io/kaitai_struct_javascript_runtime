export class EOFError extends Error {
  constructor(readonly requestedBytes: number | string, readonly availableBytes: number) {
    super(
      typeof requestedBytes === "string"
        ? requestedBytes
        : `Requested <${requestedBytes}> bytes, but only <${availableBytes}> bytes available`,
    )
  }
}
