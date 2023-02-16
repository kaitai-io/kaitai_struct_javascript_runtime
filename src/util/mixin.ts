export type Constructor<T = {}> = new (...args: any[]) => T

export type Mixin<T, U> = (Base: Constructor<T>) => Constructor<T & U>

export function applyMixins<T, U>(base: Constructor<T>, mixin1: Mixin<T, U>): Constructor<T & U>
export function applyMixins<T, U, V>(
  base: Constructor<T>,
  mixin1: Mixin<T, U>,
  mixin2: Mixin<U, V>,
): Constructor<T & U & V>
export function applyMixins<T, U, V, W>(
  base: Constructor<T>,
  mixin1: Mixin<T, U>,
  mixin2: Mixin<U, V>,
  mixin3: Mixin<V, W>,
): Constructor<T & U & V & W>
export function applyMixins<T, U, V, W, X>(
  base: Constructor<T>,
  mixin1: Mixin<T, U>,
  mixin2: Mixin<U, V>,
  mixin3: Mixin<V, W>,
  mixin4: Mixin<W, X>,
): Constructor<T & U & V & W & X>
export function applyMixins<T, U, V, W, X, Y>(
  base: Constructor<T>,
  mixin1: Mixin<T, U>,
  mixin2: Mixin<U, V>,
  mixin3: Mixin<V, W>,
  mixin4: Mixin<W, X>,
  mixin5: Mixin<X, Y>,
): Constructor<T & U & V & W & X & Y>
export function applyMixins<T, U, V, W, X, Y, Z>(
  base: Constructor<T>,
  mixin1: Mixin<T, U>,
  mixin2: Mixin<U, V>,
  mixin3: Mixin<V, W>,
  mixin4: Mixin<W, X>,
  mixin5: Mixin<X, Y>,
  mixin6: Mixin<Y, Z>,
): Constructor<T & U & V & W & X & Y & Z>
export function applyMixins<T, U, V, W, X, Y, Z, A>(
  base: Constructor<T>,
  mixin1: Mixin<T, U>,
  mixin2: Mixin<U, V>,
  mixin3: Mixin<V, W>,
  mixin4: Mixin<W, X>,
  mixin5: Mixin<X, Y>,
  mixin6: Mixin<Y, Z>,
  mixin7: Mixin<Z, A>,
): Constructor<T & U & V & W & X & Y & Z & A>
export function applyMixins<T, U, V, W, X, Y, Z, A, B>(
  base: Constructor<T>,
  mixin1: Mixin<T, U>,
  mixin2: Mixin<U, V>,
  mixin3: Mixin<V, W>,
  mixin4: Mixin<W, X>,
  mixin5: Mixin<X, Y>,
  mixin6: Mixin<Y, Z>,
  mixin7: Mixin<Z, A>,
  mixin8: Mixin<A, B>,
): Constructor<T & U & V & W & X & Y & Z & A & B>

export function applyMixins(base: Constructor, ...mixins: Mixin<Constructor, Constructor>[]): Constructor {
  const [mixin, ...rest] = mixins
  // @ts-expect-error TODO
  return rest.length > 0 ? applyMixins(mixin(base), ...rest) : mixin(base)
}
