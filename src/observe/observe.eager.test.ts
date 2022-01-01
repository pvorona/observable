import { observable } from '../observable'
import { observe } from './observe'

describe('observe', () => {
  const observer = jest.fn()

  afterEach(() => {
    observer.mockClear()
  })

  describe('with eager observables', () => {
    it('calls observer immediately after initialization', () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)

      observe([o1, o2, o3], observer)

      expect(observer).toHaveBeenCalledTimes(1)
      expect(observer).toHaveBeenCalledWith(1, 2, 3)
    })

    it('calls observer every time any observed value changes', () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)

      observe([o1, o2, o3], observer)

      o1.set(4)

      expect(observer).toHaveBeenCalledTimes(2)
      expect(observer).toHaveBeenLastCalledWith(4, 2, 3)

      o2.set(5)

      expect(observer).toHaveBeenCalledTimes(3)
      expect(observer).toHaveBeenLastCalledWith(4, 5, 3)

      o3.set(6)

      expect(observer).toHaveBeenCalledTimes(4)
      expect(observer).toHaveBeenLastCalledWith(4, 5, 6)
    })

    it("doesn't call observer if observed values don't change", () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)

      observe([o1, o2, o3], observer)

      o1.set(1)
      o1.set(1)
      o1.set(1)

      o2.set(2)
      o2.set(2)
      o2.set(2)

      o3.set(3)
      o3.set(3)
      o3.set(3)

      expect(observer).toHaveBeenCalledTimes(1)
    })

    it("doesn't call observer if any observed value changes after unsubscribing", () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)

      const unobserve = observe([o1, o2, o3], observer)

      unobserve()

      o1.set(4)
      o2.set(5)
      o3.set(6)

      expect(observer).toHaveBeenCalledTimes(1)
    })
  })
})
