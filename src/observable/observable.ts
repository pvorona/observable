import { removeFirstElementOccurrence } from '../utils'
import { Observer, EagerObservable, Settable, Gettable } from '../types'

export function observable<T>(
  initialValue: T,
): EagerObservable<T> & Settable<T> & Gettable<T> {
  let value = initialValue
  const observers: Observer<T>[] = []

  // EXtract function to reuse across all observables
  function notify() {
    for (const observer of observers) {
      observer(value)
    }
  }

  return {
    set(newValueOrFactory) {
      const newValue =
        newValueOrFactory instanceof Function
          ? newValueOrFactory(value)
          : newValueOrFactory

      if (newValue === value) {
        return
      }

      value = newValue

      notify()
    },
    get() {
      return value
    },
    // fire immediately can solve Gettable dependency
    observe(observer) {
      observers.push(observer)

      return () => {
        removeFirstElementOccurrence(observers, observer)
      }
    },
  }
}
