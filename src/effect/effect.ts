import { Lambda, Gettable, Observable } from '../types'
import { createScheduleEffect as defaultCreateScheduleEffect } from '../rendering'
import { collectValues } from '../utils'
import { observe } from '../observe'

export function effect(
  deps: readonly [],
  observer: () => void,
  createScheduleEffect?: (performEffect: Lambda) => Lambda,
): Lambda
export function effect<A>(
  deps: readonly [Observable<A> & Gettable<A>],
  observer: (a: A) => void,
  createScheduleEffect?: (performEffect: Lambda) => Lambda,
): Lambda
export function effect<A, B>(
  deps: readonly [Observable<A> & Gettable<A>, Observable<B> & Gettable<B>],
  observer: (a: A, b: B) => void,
  createScheduleEffect?: (performEffect: Lambda) => Lambda,
): Lambda
export function effect<A, B, C>(
  deps: readonly [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
  ],
  observer: (a: A, b: B, c: C) => void,
  createScheduleEffect?: (performEffect: Lambda) => Lambda,
): Lambda
export function effect<A, B, C, D>(
  deps: readonly [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
  ],
  observer: (a: A, b: B, c: C, d: D) => void,
  createScheduleEffect?: (performEffect: Lambda) => Lambda,
): Lambda
export function effect<A, B, C, D, E>(
  deps: readonly [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
  ],
  observer: (a: A, b: B, c: C, d: D, e: E) => void,
  createScheduleEffect?: (performEffect: Lambda) => Lambda,
): Lambda
export function effect<A, B, C, D, E, F>(
  deps: readonly [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
  ],
  observer: (a: A, b: B, c: C, d: D, e: E, f: F) => void,
  createScheduleEffect?: (performEffect: Lambda) => Lambda,
): Lambda
export function effect<A, B, C, D, E, F, G>(
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
  createScheduleEffect?: (performEffect: Lambda) => Lambda,
): Lambda
export function effect(
  deps: readonly (Observable<unknown> & Gettable<unknown>)[],
  observer: (...args: unknown[]) => void,
  createScheduleEffect: (performEffect: Lambda) => Lambda,
): Lambda
export function effect(
  deps: readonly (Observable<unknown> & Gettable<unknown>)[],
  observer: (...args: unknown[]) => void,
  createScheduleEffect: (
    performEffect: Lambda,
  ) => Lambda = defaultCreateScheduleEffect,
): Lambda {
  let hasScheduledEffect = false

  const scheduleEffect = createScheduleEffect(function performEffect() {
    const values = collectValues(deps)

    observer(...values)
    hasScheduledEffect = false
  })

  const scheduleNotify = () => {
    if (hasScheduledEffect) {
      return
    }

    hasScheduledEffect = true
    scheduleEffect()
  }

  return observe(deps, scheduleNotify, { collectValues: false })
}
