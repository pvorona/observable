import { observable } from '../observable'
import { collectValues, observe } from '../observe'
import { EagerObservable, Gettable, Observable } from '../types'

export function compute<O>(
  deps: [],
  compute: () => O,
): EagerObservable<O> & Gettable<O>
export function compute<A, O>(
  deps: [Observable<A> & Gettable<A>],
  compute: (a: A) => O,
): EagerObservable<O> & Gettable<O>
export function compute<A, B, O>(
  deps: [Observable<A> & Gettable<A>, Observable<B> & Gettable<B>],
  compute: (a: A, b: B) => O,
): EagerObservable<O> & Gettable<O>
export function compute<A, B, C, O>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
  ],
  compute: (a: A, b: B, c: C) => O,
): EagerObservable<O> & Gettable<O>
export function compute<A, B, C, D, O>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
  ],
  compute: (a: A, b: B, c: C, d: D) => O,
): EagerObservable<O> & Gettable<O>
export function compute<A, B, C, D, E, O>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
  ],
  compute: (a: A, b: B, c: C, d: D, e: E) => O,
): EagerObservable<O> & Gettable<O>
export function compute<A, B, C, D, E, F, O>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
  ],
  compute: (a: A, b: B, c: C, d: D, e: E, f: F) => O,
): EagerObservable<O> & Gettable<O>
export function compute<A, B, C, D, E, F, G, O>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
    Observable<G> & Gettable<G>,
  ],
  compute: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => O,
): EagerObservable<O> & Gettable<O>
export function compute<O>(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  compute: (...args: unknown[]) => O,
): EagerObservable<O> & Gettable<O>
export function compute(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  compute: (...args: unknown[]) => unknown,
): EagerObservable<unknown> & Gettable<unknown> {
  const obs = observable<unknown>(undefined)

  observe(deps, recompute)

  recompute()

  function recompute() {
    obs.set(compute(...collectValues(deps)))
  }

  return {
    get: obs.get,
    observe: obs.observe,
  }
}
