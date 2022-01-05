import { collectValues as collectValuesUtil } from '../utils'
import { Lambda, Observable, Gettable } from '../types'

export type Options = {
  readonly collectValues?: boolean
  readonly fireImmediately?: boolean
}

const DEFAULT_OPTIONS: Options = {
  collectValues: true,
  fireImmediately: true,
}

// TODO fix observer type based on options
export function observe(
  deps: readonly [],
  observer: () => void,
  options?: Options,
): Lambda
export function observe<A>(
  deps: readonly [Observable<A> & Gettable<A>],
  observer: (a: A) => void,
  options?: Options,
): Lambda
export function observe<A, B>(
  deps: readonly [Observable<A> & Gettable<A>, Observable<B> & Gettable<B>],
  observer: (a: A, b: B) => void,
  options?: Options,
): Lambda
export function observe<A, B, C>(
  deps: readonly [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
  ],
  observer: (a: A, b: B, c: C) => void,
  options?: Options,
): Lambda
export function observe<A, B, C, D>(
  deps: readonly [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
  ],
  observer: (a: A, b: B, c: C, d: D) => void,
  options?: Options,
): Lambda
export function observe<A, B, C, D, E>(
  deps: readonly [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
  ],
  observer: (a: A, b: B, c: C, d: D, e: E) => void,
  options?: Options,
): Lambda
export function observe<A, B, C, D, E, F>(
  deps: readonly [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
  ],
  observer: (a: A, b: B, c: C, d: D, e: E, f: F) => void,
  options?: Options,
): Lambda
export function observe<A, B, C, D, E, F, G>(
  deps: readonly [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
    Observable<G> & Gettable<G>,
  ],
  observer: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => void,
  options?: Options,
): Lambda
export function observe(
  deps: readonly (Observable<unknown> & Gettable<unknown>)[],
  observer: (...args: unknown[]) => void,
  options?: Options,
): Lambda
export function observe(
  deps: readonly (Observable<unknown> & Gettable<unknown>)[],
  observer: (...args: unknown[]) => void,
  {
    fireImmediately = DEFAULT_OPTIONS.fireImmediately,
    collectValues = DEFAULT_OPTIONS.collectValues,
  }: Options = DEFAULT_OPTIONS,
): Lambda {
  // negate to prevent function allocation when possible
  const decoratedObserver = !collectValues
    ? observer
    : () => observer(...collectValuesUtil(deps))
  const unobserves = deps.map(dep => dep.observe(decoratedObserver))

  if (fireImmediately) {
    decoratedObserver()
  }

  return () => {
    unobserves.forEach(unobserve => unobserve())
  }
}
