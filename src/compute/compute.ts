import { observable } from '../observable'
import { observe } from '../observe'
import { EagerObservable, Gettable, Observable } from '../types'

export function compute<T>(
  deps: [],
  compute: () => T,
): EagerObservable<T> & Gettable<T>
export function compute<A, T>(
  deps: [Observable<A> & Gettable<A>],
  compute: (a: A) => T,
): EagerObservable<T> & Gettable<T>
export function compute<A, B, T>(
  deps: [Observable<A> & Gettable<A>, Observable<B> & Gettable<B>],
  compute: (a: A, b: B) => T,
): EagerObservable<T> & Gettable<T>
export function compute<A, B, C, T>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
  ],
  compute: (a: A, b: B, c: C) => T,
): EagerObservable<T> & Gettable<T>
export function compute<A, B, C, D, T>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
  ],
  compute: (a: A, b: B, c: C, d: D) => T,
): EagerObservable<T> & Gettable<T>
export function compute<A, B, C, D, E, T>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
  ],
  compute: (a: A, b: B, c: C, d: D, e: E) => T,
): EagerObservable<T> & Gettable<T>
export function compute<A, B, C, D, E, F, T>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
  ],
  compute: (a: A, b: B, c: C, d: D, e: E, f: F) => T,
): EagerObservable<T> & Gettable<T>
export function compute<A, B, C, D, E, F, G, T>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
    Observable<G> & Gettable<G>,
  ],
  compute: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => T,
): EagerObservable<T> & Gettable<T>
export function compute<T>(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  compute: (...args: unknown[]) => T,
): EagerObservable<T> & Gettable<T>
export function compute<T>(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  compute: (...args: unknown[]) => T,
): EagerObservable<T> & Gettable<T> {
  const obs = observable<T>(undefined)

  observe(deps, (...values) => {
    obs.set(compute(...values))
  })

  return {
    get: obs.get,
    observe: obs.observe,
  }
}
