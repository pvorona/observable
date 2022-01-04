import { removeFirstElementOccurrence } from '../removeFirstElementOccurrence'
import { collectValues } from '../collectValues'
import { Lambda, Gettable, LazyObservable, Observable } from '../types'

export function computeLazy<T>(
  deps: [],
  compute: () => T,
): LazyObservable & Gettable<T>
export function computeLazy<A, T>(
  deps: [Observable<A> & Gettable<A>],
  compute: (a: A) => T,
): LazyObservable & Gettable<T>
export function computeLazy<A, B, T>(
  deps: [Observable<A> & Gettable<A>, Observable<B> & Gettable<B>],
  compute: (a: A, b: B) => T,
): LazyObservable & Gettable<T>
export function computeLazy<A, B, C, T>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
  ],
  compute: (a: A, b: B, c: C) => T,
): LazyObservable & Gettable<T>
export function computeLazy<A, B, C, D, T>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
  ],
  compute: (a: A, b: B, c: C, d: D) => T,
): LazyObservable & Gettable<T>
export function computeLazy<A, B, C, D, E, T>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
  ],
  compute: (a: A, b: B, c: C, d: D, e: E) => T,
): LazyObservable & Gettable<T>
export function computeLazy<A, B, C, D, E, F, T>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
  ],
  compute: (a: A, b: B, c: C, d: D, e: E, f: F) => T,
): LazyObservable & Gettable<T>
export function computeLazy<A, B, C, D, E, F, G, T>(
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
): LazyObservable & Gettable<T>
export function computeLazy<T>(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  compute: (...args: unknown[]) => T,
): LazyObservable & Gettable<T>
export function computeLazy<T>(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  compute: (...args: unknown[]) => T,
): LazyObservable & Gettable<T> {
  const observers: Lambda[] = []
  let value: T
  let dirty = true

  for (const dep of deps) {
    dep.observe(markDirty)
  }

  function markDirty() {
    dirty = true
    for (const observer of observers) {
      observer()
    }
  }

  function recompute() {
    const values = collectValues(deps)

    return compute(...values)
  }

  return {
    get() {
      if (dirty) {
        value = recompute()
        dirty = false
      }
      return value
    },
    observe(observer: Lambda) {
      observers.push(observer)

      return () => {
        removeFirstElementOccurrence(observers, observer)
      }
    },
  }
}
