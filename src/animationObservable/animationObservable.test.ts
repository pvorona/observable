/**
 * @jest-environment jsdom
 */

import { observable } from '../observable'
import { groupTransition, transition } from '../transition'
import { animationObservable } from './animationObservable'

const TRANSITION_DURATION = 100

describe('with numbers', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('starts with initial value', () => {
    const o = observable(0)
    const t = transition(0, TRANSITION_DURATION)
    const animation = animationObservable(o, t)

    expect(animation.get()).toStrictEqual(0)
    expect(o.get()).toStrictEqual(animation.get())
  })

  it('does not change over time if the source is stationary', () => {
    const o = observable(0)
    const t = transition(0, TRANSITION_DURATION)
    const animation = animationObservable(o, t)

    jest.advanceTimersByTime(TRANSITION_DURATION * 10)

    expect(animation.get()).toStrictEqual(0)
    expect(o.get()).toStrictEqual(animation.get())
  })

  it("transitions to the end value using the transition but doesn't overshoot", () => {
    const o = observable(0)
    const t = transition(0, TRANSITION_DURATION)
    const animation = animationObservable(o, t)
    const endValue = 100

    o.set(endValue)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual(endValue * 0.1)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual(endValue * 0.2)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.3)

    expect(animation.get()).toStrictEqual(endValue * 0.5)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.4)

    expect(animation.get()).toStrictEqual(endValue * 0.9)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual(endValue * 1.0)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual(endValue * 1.0)

    jest.advanceTimersByTime(TRANSITION_DURATION * 10)

    expect(animation.get()).toStrictEqual(endValue * 1.0)

    o.set(200)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual(110)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual(120)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual(130)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual(140)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual(150)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.5)

    expect(animation.get()).toStrictEqual(200)

    jest.advanceTimersByTime(TRANSITION_DURATION * 10)

    expect(animation.get()).toStrictEqual(200)
  })

  it('transitions to the new end value if the target changed during the animation', () => {
    const o = observable(0)
    const t = transition(0, TRANSITION_DURATION)
    const animation = animationObservable(o, t)

    o.set(1000)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual(100)

    o.set(2000)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual(290)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual(290 + 190)

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual(290 + 190 + 190)

    jest.advanceTimersByTime(TRANSITION_DURATION)

    expect(animation.get()).toStrictEqual(2000)
  })
})

describe('with objects', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('starts with initial value', () => {
    const o = observable({
      a: 0,
      b: 0,
      c: 0,
      d: 0,
    })
    const t = groupTransition({
      a: transition(0, TRANSITION_DURATION),
      b: transition(0, TRANSITION_DURATION),
      c: transition(0, TRANSITION_DURATION),
      d: transition(0, TRANSITION_DURATION),
    })
    const animation = animationObservable(o, t)

    expect(animation.get()).toStrictEqual({
      a: 0,
      b: 0,
      c: 0,
      d: 0,
    })
  })

  it('transitions to the end value using the transition', () => {
    const o = observable({
      a: 0,
      b: 0,
      c: 0,
      d: 0,
    })
    const t = groupTransition({
      a: transition(0, TRANSITION_DURATION),
      b: transition(0, TRANSITION_DURATION),
      c: transition(0, TRANSITION_DURATION),
      d: transition(0, TRANSITION_DURATION),
    })
    const animation = animationObservable(o, t)

    o.set({
      a: 10,
      b: 20,
      c: 30,
      d: 40,
    })

    expect(o.get()).toStrictEqual({
      a: 10,
      b: 20,
      c: 30,
      d: 40,
    })

    expect(animation.get()).toStrictEqual({
      a: 0,
      b: 0,
      c: 0,
      d: 0,
    })

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    })

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual({
      a: 2,
      b: 4,
      c: 6,
      d: 8,
    })

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual({
      a: 3,
      b: 6,
      c: 9,
      d: 12,
    })

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual({
      a: 4,
      b: 8,
      c: 12,
      d: 16,
    })

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.6)

    expect(animation.get()).toStrictEqual({
      a: 10,
      b: 20,
      c: 30,
      d: 40,
    })

    jest.advanceTimersByTime(TRANSITION_DURATION)

    expect(animation.get()).toStrictEqual({
      a: 10,
      b: 20,
      c: 30,
      d: 40,
    })
  })

  it('transitions to the end value if the target changed during the animation', () => {
    const o = observable({
      a: 0,
      b: 0,
      c: 0,
      d: 0,
    })
    const t = groupTransition({
      a: transition(0, TRANSITION_DURATION),
      b: transition(0, TRANSITION_DURATION),
      c: transition(0, TRANSITION_DURATION),
      d: transition(0, TRANSITION_DURATION),
    })
    const animation = animationObservable(o, t)

    o.set({
      a: 10,
      b: 20,
      c: 30,
      d: 40,
    })

    expect(animation.get()).toStrictEqual({
      a: 0,
      b: 0,
      c: 0,
      d: 0,
    })

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    })

    o.set({
      a: 101,
      b: 202,
      c: 303,
      d: 404,
    })

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual({
      a: 11,
      b: 22,
      c: 33,
      d: 44,
    })

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual({
      a: 21,
      b: 42,
      c: 63,
      d: 84,
    })

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual({
      a: 31,
      b: 62,
      c: 93,
      d: 124,
    })

    jest.advanceTimersByTime(TRANSITION_DURATION * 0.1)

    expect(animation.get()).toStrictEqual({
      a: 41,
      b: 82,
      c: 123,
      d: 164,
    })

    jest.advanceTimersByTime(TRANSITION_DURATION)

    expect(animation.get()).toStrictEqual({
      a: 101,
      b: 202,
      c: 303,
      d: 404,
    })
  })
})
