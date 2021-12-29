export type Lambda = () => void

export type Observer<A> = (value: A) => void

export type Observable<A> = {
  observe: (observer: Observer<A>) => Lambda
}

export type Settable<A> = {
  set: (value: A) => void
}

export type Gettable<A> = {
  get: () => A
}

export type LazyObservable<A> = Gettable<A> & {
  observe: (observer: Lambda) => Lambda
}
