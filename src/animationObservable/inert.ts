import { LazyObservable, Gettable, Observable } from '../types'
import { createTransition } from '../transition'
import { createScheduleTaskWithCleanup, PRIORITY } from '@pvorona/scheduling'
import { observe } from '../observe'
import { observable } from '../observable'

type Easing = (progress: number) => number

type Options = {
  duration: number
  easing?: Easing
}

export function inert(options: Options) {
  return function (
    target: Observable<number> & Gettable<number>,
  ): LazyObservable & Gettable<number> {
    const transition = createTransition({
      ...options,
      initialValue: target.get(),
    })
    const currentValue = observable.lazy(transition.get)

    const scheduleMarkChangedWithCleanup = createScheduleTaskWithCleanup(
      currentValue.markChanged,
      PRIORITY.FUTURE,
    )

    observe(
      [target],
      value => {
        transition.setTarget(value)

        if (!transition.isFinished()) {
          currentValue.markChanged()
        }
      },
      { fireImmediately: false },
    )

    return {
      get() {
        if (!transition.isFinished()) {
          scheduleMarkChangedWithCleanup()
        }

        return currentValue.get()
      },
      observe: currentValue.observe,
    }
  }
}
