import { Observable, Gettable } from '../types'

export function collectValues(deps: []): []
export function collectValues<A>(deps: [Observable<A> & Gettable<A>]): [A]
export function collectValues<A, B>(
  deps: [Observable<A> & Gettable<A>, Observable<B> & Gettable<B>],
): [A, B]
export function collectValues<A, B, C>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
  ],
): [A, B, C]
export function collectValues<A, B, C, D>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
  ],
): [A, B, C, D]
export function collectValues<A, B, C, D, E>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
  ],
): [A, B, C, D, E]
export function collectValues<A, B, C, D, E, F>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
  ],
): [A, B, C, D, E, F]
export function collectValues<A, B, C, D, E, F, G>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
    Observable<G> & Gettable<G>,
  ],
): [A, B, C, D, E, F, G]
export function collectValues(
  deps: (Observable<unknown> & Gettable<unknown>)[],
): unknown[]
export function collectValues(
  deps: (Observable<unknown> & Gettable<unknown>)[],
): unknown[] {
  return deps.map(dep => dep.get())
}
