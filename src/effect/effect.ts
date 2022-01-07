import { Lambda, Gettable, Observable, InferTypeParams } from '../types'
import { createScheduleEffect as defaultCreateScheduleEffect } from '../rendering'
import { collectValues } from '../utils'
import { observe } from '../observe'

export function effect<T extends (Observable<unknown> & Gettable<unknown>)[]>(
  deps: readonly [...T],
  observer: (...args: InferTypeParams<T>) => void,
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
