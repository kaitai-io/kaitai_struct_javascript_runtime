export function convertFloat16(raw: number): number {
  const uint32 = new Uint32Array(1)
  uint32[0] = ((raw & 0x8000) << 16) | (((raw & 0x7c00) + 0x1c000) << 13) | ((raw & 0x03ff) << 13)
  const float32 = new Float32Array(uint32.buffer)
  return float32[0]
}
