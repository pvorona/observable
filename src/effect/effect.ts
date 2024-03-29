import { Lambda, Gettable, Observable, InferTypeParams } from '../types'
import { createScheduleTaskWithCleanup } from '@pvorona/scheduling'
import { collectValues } from '../utils'
import { observe } from '../observe'

type Options = {
  readonly fireImmediately?: boolean
}

const DEFAULT_OPTIONS: Options = {
  fireImmediately: true,
}

export function effect<T extends (Observable<unknown> & Gettable<unknown>)[]>(
  deps: readonly [...T],
  observer: (...args: InferTypeParams<T>) => void,
  options = DEFAULT_OPTIONS,
): Lambda {
  const scheduleNotifyWithCleanup = createScheduleTaskWithCleanup(
    function performEffect() {
      observer(...collectValues(deps))
    },
  )

  return observe(deps, scheduleNotifyWithCleanup, {
    collectValues: false,
    ...options,
  })
}
