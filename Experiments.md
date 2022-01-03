!!! Prevent overfitting !!!
What makes sense:
- collectValues
- removeAllElementOccurrences
- observe with or without values
- observe with or without immediate invocation

// OR

  const time = observable(set => {
    set(Date.now())

    setInterval(() => {
      set(Date.now())
    }, 1000)
  })

  // OR

  const time = observable(()* => {
    while (true) {
      yield Date.now()
      await delay(1000)
    }
  })

  // OR

  const time = observable(async (set) => {
    while (true) {
      set(Date.now())
      await delay(1000)
    }
  })



  // export type Observable<T> = (EagerObservable<T> | LazyObservable) & Gettable<T>

// type Compute<T, O> = (
//   deps: [Observable<T>],
//   compute: (t: T) => O,
// ) => EagerObservable<O>

// type ComputeLazy<T, O> = (
//   deps: [Observable<T>],
//   compute: (t: T) => O,
// ) => LazyObservable & Gettable<O>