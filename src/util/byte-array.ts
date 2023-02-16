export function bytesStripRight(data: Uint8Array, padByte: number) {
  let newLength = data.length
  while (data[newLength - 1] === padByte) {
    newLength--
  }
  return data.slice(0, newLength)
}

export function bytesTerminate(data: Uint8Array, terminal: number, include = false) {
  let newLength = 0
  while (newLength < data.length && data[newLength] !== terminal) {
    newLength++
  }
  if (include && newLength < data.length) newLength++
  return data.slice(0, newLength)
}

export function byteArrayCompare(a: Uint8Array, b: Uint8Array) {
  if (a === b) return 0

  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    let result = a[i] - b[i]
    if (result !== 0) return result
  }

  if (a.length === b.length) {
    return 0
  } else {
    return a.length - b.length
  }
}
