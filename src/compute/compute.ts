import { observable } from '../observable'
import { observe } from '../observe'
import { EagerObservable, Settable, Gettable, Observable } from '../types'

export function compute<A, O>(
  deps: [Observable<A> & Gettable<A>],
  compute: (valueA: A) => O,
): EagerObservable<O> & Gettable<O> & Settable<O>
export function compute<A, B, O>(
  deps: [Observable<A> & Gettable<A>, Observable<B> & Gettable<B>],
  compute: (valueA: A, valueB: B) => O,
): EagerObservable<O> & Gettable<O> & Settable<O>
export function compute<A, B, C, O>(
  deps: [
    Observable<A> & Gettable<A>,
    Observable<B> & Gettable<B>,
    Observable<C> & Gettable<C>,
  ],
  compute: (valueA: A, valueB: B, valueC: C) => O,
): EagerObservable<O> & Gettable<O> & Settable<O>
export function compute(
  deps: (Observable<unknown> & Gettable<unknown>)[],
  compute: (...args: unknown[]) => unknown,
): EagerObservable<unknown> & Gettable<unknown> & Settable<unknown> {
  const obs = observable(null)
  const unobserveComputation = observe(deps, (...values) => {
    obs.set(compute(...values))
  })

  return {
    ...obs,
    observe: observer => {
      const unobserve = obs.observe(observer)

      return () => {
        unobserveComputation()
        unobserve()
      }
    },
  }
}
