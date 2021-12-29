import { Lambda, Observable, Gettable } from '../types'

export function observe<A>(deps: [], observer: (valueA: A) => void): Lambda
export function observe<A>(
  deps: [Observable<A> & Gettable<A>],
  observer: (valueA: A) => void,
): Lambda
export function observe<A, B>(
  deps: [Observable<A> & Gettable<A>, Observable<B> & Gettable<B>],
  observer: (valueA: A, valueB: B) => void,
): Lambda
export function observe<A, B, C>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
  ],
  observer: (valueA: A, valueB: B, valueC: C) => void,
): Lambda
export function observe<A, B, C, D>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
  ],
  observer: (valueA: A, valueB: B, valueC: C, valueD: D) => void,
): Lambda
export function observe(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  observer: (...args: unknown[]) => unknown,
): Lambda
export function observe(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  observer: (...args: unknown[]) => unknown,
): Lambda {
  notify()

  const unobserves = deps.map(dep => dep.observe(notify))

  function notify() {
    observer(...deps.map(dep => dep.get()))
  }

  return () => {
    unobserves.forEach(unobserve => unobserve())
  }
}
