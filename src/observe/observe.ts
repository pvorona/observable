import { collectValues as collectValuesUtil } from '../utils'
import { Lambda, Observable, Gettable, InferTypeParams } from '../types'

export type Options = {
  readonly collectValues?: boolean
  readonly fireImmediately?: boolean
}

const DEFAULT_OPTIONS: Options = {
  collectValues: true,
  fireImmediately: true,
}

// FIX TYPE
export function observe<T extends (Observable<unknown> & Gettable<unknown>)[]>(
  deps: readonly [...T],
  observer: (...args: InferTypeParams<T>) => void,
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
