import { Lambda, Observable, Gettable } from '../types'
import { collectValues } from './collectValues'
import { observe } from './observe'

export function observeValues(deps: [], observer: () => void): Lambda
export function observeValues<A>(
  deps: [Observable<A> & Gettable<A>],
  observer: (a: A) => void,
): Lambda
export function observeValues<A, B>(
  deps: [Observable<A> & Gettable<A>, Observable<B> & Gettable<B>],
  observer: (a: A, b: B) => void,
): Lambda
export function observeValues<A, B, C>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
  ],
  observer: (a: A, b: B, c: C) => void,
): Lambda
export function observeValues<A, B, C, D>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
  ],
  observer: (a: A, b: B, c: C, d: D) => void,
): Lambda
export function observeValues<A, B, C, D, E>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
  ],
  observer: (a: A, b: B, c: C, d: D, e: E) => void,
): Lambda
export function observeValues<A, B, C, D, E, F>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
  ],
  observer: (a: A, b: B, c: C, d: D, e: E, f: F) => void,
): Lambda
export function observeValues<A, B, C, D, E, F, G>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
    Observable<G> & Gettable<G>,
  ],
  observer: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => void,
): Lambda
export function observeValues(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  observer: (...args: unknown[]) => void,
): Lambda
export function observeValues(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  observer: (...args: unknown[]) => void,
): Lambda
export function observeValues(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  observer: (...args: unknown[]) => void,
): Lambda {
  function notify() {
    observer(...collectValues(deps))
  }

  notify()

  return observe(deps, notify)
}
