export function createArray<A>(
  length: number,
  valueOrFactory: A | ((index: number) => A),
): A[] {
  return Array.from({ length }, (_, index) =>
    valueOrFactory instanceof Function ? valueOrFactory(index) : valueOrFactory,
  )
}
