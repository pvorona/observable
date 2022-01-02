export type Lambda = () => void

export type Observer<A> = (value: A) => void

export type EagerObservable<T> = {
  observe: (observer: Observer<T>) => Lambda
}

export type LazyObservable = {
  observe: (observer: Lambda) => Lambda
}

export type Settable<A> = {
  set: (value: A) => void
}

export type Gettable<A> = {
  get: () => A
}

export type Observable<T> = EagerObservable<T> | LazyObservable
