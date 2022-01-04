import { Gettable } from '../types'

export function collectValues(observables: []): []
export function collectValues<A>(observables: [Gettable<A>]): [A]
export function collectValues<A, B>(
  observables: [Gettable<A>, Gettable<B>],
): [A, B]
export function collectValues<A, B, C>(
  observables: [Gettable<A>, Gettable<B>, Gettable<C>],
): [A, B, C]
export function collectValues<A, B, C, D>(
  observables: [Gettable<A>, Gettable<B>, Gettable<C>, Gettable<D>],
): [A, B, C, D]
export function collectValues<A, B, C, D, E>(
  observables: [
    Gettable<A>,
    Gettable<B>,
    Gettable<C>,
    Gettable<D>,
    Gettable<E>,
  ],
): [A, B, C, D, E]
export function collectValues<A, B, C, D, E, F>(
  observables: [
    Gettable<A>,
    Gettable<B>,
    Gettable<C>,
    Gettable<D>,
    Gettable<E>,
    Gettable<F>,
  ],
): [A, B, C, D, E, F]
export function collectValues<A, B, C, D, E, F, G>(
  observables: [
    Gettable<A>,
    Gettable<B>,
    Gettable<C>,
    Gettable<D>,
    Gettable<E>,
    Gettable<F>,
    Gettable<G>,
  ],
): [A, B, C, D, E, F, G]
export function collectValues(observables: Gettable<unknown>[]): unknown[]
export function collectValues(observables: Gettable<unknown>[]) {
  const values = []

  for (let i = 0; i < observables.length; i++) {
    values.push(observables[i].get())
  }

  return values
}
