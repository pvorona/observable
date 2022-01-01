import { observable } from '../observable'
import { EagerObservable, Settable, Gettable } from '../types'

// can be implemented in terms of observe?
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
  const obs = observable(recompute())

  const unobserves = deps.map(dep => dep.observe(onChange))

  function onChange() {
    obs.set(recompute())
  }

  function recompute() {
    return compute(...deps.map(dep => dep.get()))
  }

  return {
    ...obs,
    observe: observer => {
      const ownUnobserve = obs.observe(observer)

      return () => {
        ownUnobserve()
        unobserves.forEach(unobserve => unobserve())
      }
    },
  }
}
