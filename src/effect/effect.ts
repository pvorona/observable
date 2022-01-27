import { Lambda, Gettable, Observable, InferTypeParams } from '../types'
import { createScheduleTaskWithCleanup } from '@pvorona/scheduling'
import { collectValues } from '../utils'
import { observe } from '../observe'

export function effect<T extends (Observable<unknown> & Gettable<unknown>)[]>(
  deps: readonly [...T],
  observer: (...args: InferTypeParams<T>) => void,
): Lambda {
  const scheduleNotifyWithCleanup = createScheduleTaskWithCleanup(
    function performEffect() {
      observer(...collectValues(deps))
    },
  )

  return observe(deps, scheduleNotifyWithCleanup, { collectValues: false })
}
