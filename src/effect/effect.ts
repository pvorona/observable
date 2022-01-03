import { Lambda, Gettable, Observable } from '../types'
import { createScheduleEffect as defaultCreateScheduleEffect } from '../rendering'
import { collectValues, observe } from '../observe'

export function effect(
  deps: [],
  observer: () => void,
  createScheduleEffect?: (l: Lambda) => Lambda,
): Lambda
export function effect<A>(
  deps: [Observable<A> & Gettable<A>],
  observer: (a: A) => void,
  createScheduleEffect?: (l: Lambda) => Lambda,
): Lambda
export function effect<A, B>(
  deps: [Observable<A> & Gettable<A>, Observable<B> & Gettable<B>],
  observer: (a: A, b: B) => void,
  createScheduleEffect?: (l: Lambda) => Lambda,
): Lambda
export function effect<A, B, C>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
  ],
  observer: (a: A, b: B, c: C) => void,
  createScheduleEffect?: (l: Lambda) => Lambda,
): Lambda
export function effect<A, B, C, D>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
  ],
  observer: (a: A, b: B, c: C, d: D) => void,
  createScheduleEffect?: (l: Lambda) => Lambda,
): Lambda
export function effect<A, B, C, D, E>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
  ],
  observer: (a: A, b: B, c: C, d: D, e: E) => void,
  createScheduleEffect?: (l: Lambda) => Lambda,
): Lambda
export function effect<A, B, C, D, E, F>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
    Observable<E> & Gettable<E>,
    Observable<F> & Gettable<F>,
  ],
  observer: (a: A, b: B, c: C, d: D, e: E, f: F) => void,
  createScheduleEffect?: (l: Lambda) => Lambda,
): Lambda
export function effect<A, B, C, D, E, F, G>(
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
  createScheduleEffect?: (l: Lambda) => Lambda,
): Lambda
export function effect(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  observer: (...args: unknown[]) => void,
  createScheduleEffect?: (l: Lambda) => Lambda,
): Lambda
export function effect(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  observer: (...args: unknown[]) => void,
  createScheduleEffect: (l: Lambda) => Lambda = defaultCreateScheduleEffect,
): Lambda {
  let scheduledEffect = false

  const scheduleEffect = createScheduleEffect(function performEffect() {
    observer(...collectValues(deps))
    scheduledEffect = false
  })

  const scheduleNotify = () => {
    if (scheduledEffect) return
    scheduledEffect = true
    scheduleEffect()
  }
  const unobserve = observe(deps, scheduleNotify)

  scheduleNotify()

  return unobserve
}
