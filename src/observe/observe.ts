import { Lambda, Observable, Gettable } from '../types'

export function observe(deps: [], observer: Lambda): Lambda
export function observe<A>(
  deps: [Observable<A> & Gettable<A>],
  observer: Lambda,
): Lambda
export function observe<A, B>(
  deps: [Observable<A> & Gettable<A>, Observable<B> & Gettable<B>],
  observer: Lambda,
): Lambda
export function observe<A, B, C>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
  ],
  observer: Lambda,
): Lambda
export function observe<A, B, C, D>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
  ],
  observer: Lambda,
): Lambda
export function observe<A, B, C, D, E>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
  ],
  observer: Lambda,
): Lambda
export function observe<A, B, C, D, E, F>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
  ],
  observer: Lambda,
): Lambda
export function observe<A, B, C, D, E, F, G>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
    Observable<G> & Gettable<G>,
  ],
  observer: Lambda,
): Lambda
export function observe(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  observer: Lambda,
): Lambda
export function observe(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  observer: Lambda,
): Lambda {
  const unobserves = deps.map(dep => dep.observe(observer))

  return () => {
    unobserves.forEach(unobserve => unobserve())
  }
}
