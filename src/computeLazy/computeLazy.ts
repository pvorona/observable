import { removeFirstElementOccurrence } from '../removeFirstElementOccurrence'
import { collectValues } from '../collectValues'
import { Lambda, Gettable, LazyObservable, Observable } from '../types'

export function computeLazy<A, V>(
  deps: [Observable<A> & Gettable<A>],
  compute: (valueA: A) => V,
): LazyObservable & Gettable<V>
export function computeLazy<A, B, V>(
  deps: [Observable<A> & Gettable<A>, Observable<B> & Gettable<B>],
  compute: (valueA: A, valueB: B) => V,
): LazyObservable & Gettable<V>
export function computeLazy<A, B, C, V>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
  ],
  compute: (valueA: A, valueB: B, valueC: C) => V,
): LazyObservable & Gettable<V>
export function computeLazy<A, B, C, D, V>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
  ],
  compute: (valueA: A, valueB: B, valueC: C, valueD: D) => V,
): LazyObservable & Gettable<V>
export function computeLazy<A, B, C, D, E, V>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
  ],
  compute: (valueA: A, valueB: B, valueC: C, valueD: D, valueE: E) => V,
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
  compute: (
    valueA: A,
    valueB: B,
    valueC: C,
    valueD: D,
    valueE: E,
    valueF: F,
  ) => V,
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
