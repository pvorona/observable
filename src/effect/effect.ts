import { Lambda, Gettable, Observable } from '../types'
import { createScheduleEffect as defaultCreateScheduleEffect } from '../rendering'
import { collectValues } from '../collectValues'

export function effect<A>(
  deps: [Observable<A> & Gettable<A>],
  observer: (valueA: A) => void,
  createScheduleEffect?: (l: Lambda) => Lambda,
): Lambda
export function effect<A, B>(
  deps: [Observable<A> & Gettable<A>, Observable<B> & Gettable<B>],
  observer: (valueA: A, valueB: B) => void,
  createScheduleEffect?: (l: Lambda) => Lambda,
): Lambda
export function effect<A, B, C>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
  ],
  observer: (valueA: A, valueB: B, valueC: C) => void,
  createScheduleEffect?: (l: Lambda) => Lambda,
): Lambda
export function effect<A, B, C, D>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
    Observable<D> & Gettable<D>,
  ],
  observer: (valueA: A, valueB: B, valueC: C, valueD: D) => void,
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
  observer: (valueA: A, valueB: B, valueC: C, valueD: D, valueE: E) => void,
  createScheduleEffect?: (l: Lambda) => Lambda,
): Lambda
export function effect(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  observer: (...args: unknown[]) => void,
  createScheduleEffect: (l: Lambda) => Lambda = defaultCreateScheduleEffect,
): Lambda {
  let scheduledEffect = false

  const scheduleEffect = createScheduleEffect(function notify() {
    const values = collectValues(deps)

    observer(...values)
    scheduledEffect = false
  })

  const scheduleNotify = () => {
    if (scheduledEffect) return
    scheduledEffect = true
    scheduleEffect()
  }
  const unobserves = deps.map(dep => dep.observe(scheduleNotify))

  scheduleNotify()

  return () => {
    unobserves.forEach(unobserve => unobserve())
  }
}
