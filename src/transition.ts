import { shallowEqual } from './utils'

export interface Transition<A> {
  getState: () => A
  setTarget: (target: A) => void
  getTarget: () => A
  isFinished: () => boolean
}

export type Easing = (progress: number) => number

export const linear: Easing = progress => progress

export function transition(
  initialValue: number,
  duration: number,
  easing: Easing = linear,
): Transition<number> {
  let startTime = Date.now()
  let startValue = initialValue
  let targetValue = initialValue
  let finished = true

  const getState = () => {
    const progress = Math.min((Date.now() - startTime) / duration, 1)

    if (progress === 1) {
      finished = true
    }
    return startValue + (targetValue - startValue) * easing(progress)
  }

  const isFinished = () => finished

  const setTarget = (target: number) => {
    if (target === targetValue) {
      return
    }

    startValue = getState()
    targetValue = target
    finished = false
    startTime = Date.now()
  }

  function getTarget() {
    return targetValue
  }

  return {
    getState,
    isFinished,
    setTarget,
    getTarget,
  }
}

export function groupTransition(transitions: {
  [key: string]: Transition<number>
}): Transition<{ [key: string]: number }> {
  let state = computeState()

  function computeState() {
    const newState: { [key: string]: number } = {}
    for (const key in transitions) {
      newState[key] = transitions[key].getState()
    }
    return newState
  }

  function getState() {
    const newState = computeState()
    if (shallowEqual(state, newState)) {
      // Preserve referential transparency for selectors
      return state
    }
    state = newState
    return state
  }

  function setTarget(target: { [key: string]: number }) {
    for (const key in target) {
      transitions[key].setTarget(target[key])
    }
  }

  function isFinished() {
    for (const key in transitions) {
      if (!transitions[key].isFinished()) return false
    }
    return true
  }

  function getTarget() {
    const result: { [key: string]: number } = {}
    for (const key in transitions) {
      result[key] = transitions[key].getTarget()
    }
    return result
  }

  return {
    setTarget,
    isFinished,
    getState,
    getTarget,
  }
}
