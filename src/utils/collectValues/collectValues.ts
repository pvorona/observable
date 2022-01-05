import { Gettable } from '../../types'

export function collectValues(observables: readonly []): []
export function collectValues<A>(observables: readonly [Gettable<A>]): [A]
export function collectValues<A, B>(
  observables: readonly [Gettable<A>, Gettable<B>],
): [A, B]
export function collectValues<A, B, C>(
  observables: readonly [Gettable<A>, Gettable<B>, Gettable<C>],
): [A, B, C]
export function collectValues<A, B, C, D>(
  observables: readonly [Gettable<A>, Gettable<B>, Gettable<C>, Gettable<D>],
): [A, B, C, D]
export function collectValues<A, B, C, D, E>(
  observables: readonly [
    Gettable<A>,
    Gettable<B>,
    Gettable<C>,
    Gettable<D>,
    Gettable<E>,
  ],
): [A, B, C, D, E]
export function collectValues<A, B, C, D, E, F>(
  observables: readonly [
    Gettable<A>,
    Gettable<B>,
    Gettable<C>,
    Gettable<D>,
    Gettable<E>,
    Gettable<F>,
  ],
): [A, B, C, D, E, F]
export function collectValues<A, B, C, D, E, F, G>(
  observables: readonly [
    Gettable<A>,
    Gettable<B>,
    Gettable<C>,
    Gettable<D>,
    Gettable<E>,
    Gettable<F>,
    Gettable<G>,
  ],
): [A, B, C, D, E, F, G]
export function collectValues(
  observables: readonly Gettable<unknown>[],
): unknown[]
export function collectValues(observables: readonly Gettable<unknown>[]) {
  const values = []

  for (let i = 0; i < observables.length; i++) {
    values.push(observables[i].get())
  }

  return values
}
