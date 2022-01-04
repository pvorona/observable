import { removeFirstElementOccurrence } from '../removeFirstElementOccurrence'
import { collectValues } from '../collectValues'
import { Lambda, Gettable, LazyObservable, Observable } from '../types'

export function computeLazy<V>(
  deps: [],
  compute: () => V,
): LazyObservable & Gettable<V>
export function computeLazy<A, V>(
  deps: [Observable<A> & Gettable<A>],
  compute: (a: A) => V,
): LazyObservable & Gettable<V>
export function computeLazy<A, B, V>(
  deps: [Observable<A> & Gettable<A>, Observable<B> & Gettable<B>],
  compute: (a: A, b: B) => V,
): LazyObservable & Gettable<V>
export function computeLazy<A, B, C, V>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
  ],
  compute: (a: A, b: B, c: C) => V,
): LazyObservable & Gettable<V>
export function computeLazy<A, B, C, D, V>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
  ],
  compute: (a: A, b: B, c: C, d: D) => V,
): LazyObservable & Gettable<V>
export function computeLazy<A, B, C, D, E, V>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
  ],
  compute: (a: A, b: B, c: C, d: D, e: E) => V,
): LazyObservable & Gettable<V>
export function computeLazy<A, B, C, D, E, F, V>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
  ],
  compute: (a: A, b: B, c: C, d: D, e: E, f: F) => V,
): LazyObservable & Gettable<V>
export function computeLazy<A, B, C, D, E, F, G, V>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
    Observable<G> & Gettable<G>,
  ],
  compute: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => V,
): LazyObservable & Gettable<V>
export function computeLazy<V>(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  compute: (...args: unknown[]) => V,
): LazyObservable & Gettable<V>
export function computeLazy<A>(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  compute: (...args: unknown[]) => A,
): LazyObservable & Gettable<A> {
  const observers: Lambda[] = []
  let value: A
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
