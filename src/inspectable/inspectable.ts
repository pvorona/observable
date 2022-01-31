import {
  EagerObservable,
  Settable,
  Gettable,
  InferTypeParam,
  Observer,
} from '../types'

type ObservableWithOptions<T> = EagerObservable<T> &
  // Settable<T> &
  Gettable<T> &
  Options &
  RuntimeData

type RuntimeData = {
  observers: Observer<any>[]
}

type Inspection<T> = {
  units: ObservableWithOptions<T>[]
  logs: LogEntry[]
}

type LogEntry = {
  type: 'GET' | 'SET' | 'OBSERVE'
  payload: any
  target: ObservableWithOptions<any>
}

const __INSPECTION__: Inspection<any> = {
  units: [],
  logs: [],
}

type Options = {
  name: string
}
;(window as any).__INSPECTION__ = __INSPECTION__

type Input<T> =
  | (EagerObservable<T> & Settable<T> & Gettable<T>)
  | (EagerObservable<T> & Gettable<T>)

export function inspectable<T extends Input<any>>(
  observable: T,
  options: Options,
): T {
  const observableWithOptions = {
    ...observable,
    ...options,
    observers: [] as Observer<any>[],
  }

  __INSPECTION__.units.push(observableWithOptions)

  // const originalGet = observable.get
  // const originalSet = observable.set
  // const originalObserve = observable.observe

  const baseResult: EagerObservable<InferTypeParam<T>> &
    Gettable<InferTypeParam<T>> = {
    get: () => {
      const value = observable.get()

      __INSPECTION__.logs.push({
        type: 'GET',
        payload: { value },
        target: observableWithOptions,
      })

      return value
    },
    observe: observer => {
      __INSPECTION__.logs.push({
        type: 'OBSERVE',
        payload: { observer },
        target: observableWithOptions,
      })

      observableWithOptions.observers.push(observer)

      return observable.observe(observer)
    },
  }

  if ('set' in observable) {
    return {
      ...baseResult,
      set: (
        newValueOrFactory:
          | InferTypeParam<T>
          | ((prevValue: InferTypeParam<T>) => InferTypeParam<T>),
      ) => {
        __INSPECTION__.logs.push({
          type: 'SET',
          payload: { newValueOrFactory },
          target: observableWithOptions,
        })

        observable.set(newValueOrFactory)
      },
    } as any
  } else {
    return baseResult as any
  }
}
