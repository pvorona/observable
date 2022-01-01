import { observable } from '../observable'
import { observe } from '../observe'
import { EagerObservable, Settable, Gettable } from '../types'

export function compute<A, O>(
  deps: [EagerObservable<A> & Gettable<A>],
  compute: (valueA: A) => O,
): EagerObservable<O> & Gettable<O> & Settable<O>
export function compute<A, B, O>(
  deps: [EagerObservable<A> & Gettable<A>, EagerObservable<B> & Gettable<B>],
  compute: (valueA: A, valueB: B) => O,
): EagerObservable<O> & Gettable<O> & Settable<O>
export function compute<A, B, C, O>(
  deps: [
    EagerObservable<A> & Gettable<A>,
    EagerObservable<B> & Gettable<B>,
    EagerObservable<C> & Gettable<C>,
  ],
  compute: (valueA: A, valueB: B, valueC: C) => O,
): EagerObservable<O> & Gettable<O> & Settable<O>
export function compute(
  deps: (EagerObservable<unknown> & Gettable<unknown>)[],
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
