# What makes sense:

- `observe` with or without values
- `observe` with or without immediate invocation

```ts
type Options = {
  collectValues: boolean
  fireImmediately: boolean
}

const DEFAULT_OPTIONS: Options = {
  collectValues: true,
  fireImmediately: true,
}

// With options:
observe([o1, o2], console.log, { collectValues: false, fireImmediately: false })

// With composition
observe([o1, o2], fireImmediately(withValues([o1, o2])(console.log)))
// or
observe([o1, o2], compose(fireImmediately, withValues([o1, o2]))(console.log)))

```

- `observable` initialize with function

```ts
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
```

- Extract overloaded types

## Done:

- [x] collectValues
- [x] removeAllElementOccurrences
