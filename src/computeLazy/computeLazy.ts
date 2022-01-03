import { removeElementFromArray } from '../observable'
import { collectValues, observe } from '../observe'
import { Lambda, Gettable, LazyObservable, Observable } from '../types'

type MissingType<T> = LazyObservable & Gettable<T> & { notifyChanged: Lambda }

// type InternalState<T> = { dirty: true } | { dirty: false; value: T }

const createMissingType = <T>(compute: () => T): MissingType<T> => {
  const observers: Lambda[] = []
  let value: T
  let dirty = true

  return {
    get() {
      if (dirty) {
        value = compute()
        dirty = false
      }

      return value
    },
    notifyChanged: () => {
      dirty = true

      for (const observer of observers) {
        observer()
      }
    },
    observe(observer: Lambda) {
      observers.push(observer)

      return () => {
        removeElementFromArray(observers, observer)
      }
    },
  }
}

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
  const o: MissingType<A> = createMissingType(recompute)

  observe(deps, o.notifyChanged)

  function recompute() {
    return compute(...collectValues(deps))
  }

  return o
}
