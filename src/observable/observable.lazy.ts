import { removeFirstElementOccurrence } from '../utils'
import { LazyObservable, Gettable, Lambda } from '../types'

export const lazyObservable = <T>(
  compute: () => T,
): LazyObservable & Gettable<T> & { markChanged: Lambda } => {
  const observers: Lambda[] = []
  let value: T
  let dirty = true

  return {
    get() {
      if (dirty) {
        value = compute()
        dirty = false
      }

      return value
    },
    markChanged: () => {
      dirty = true

      for (const observer of observers) {
        observer()
      }
    },
    observe(observer: Lambda) {
      observers.push(observer)

      return () => {
        removeFirstElementOccurrence(observers, observer)
      }
    },
  }
}

// export const lazyObservableReuse = <T>(
//   compute: () => T,
// ): LazyObservable & Gettable<T> & { markChanged: Lambda } => {
//   const holder = observable(undefined)
//   let dirty = true

//   return {
//     get() {
//       if (dirty) {
//         holder.set(compute())
//         dirty = false
//       }

//       return holder.get()
//     },
//     markChanged() {
//       dirty = true
//       // notify
//     },
//     observe: holder.observe,
//   }
// }
