import { Lambda, LazyObservable, Gettable, Observable } from '../types'
import { Transition } from '../transition'
import { createTask, tasks, PRIORITY, Task } from '../rendering'
import { removeFirstElementOccurrence } from '../removeFirstElementOccurrence'

export function animationObservable<T>(
  innerObservable: Observable<T> & Gettable<T>,
  initialTransition: Transition<T>,
): LazyObservable &
  Gettable<T> & { setTransition: (transition: Transition<T>) => void } {
  const observers: Lambda[] = []
  let futureTask: Task | undefined = undefined
  let transition = initialTransition
  let state = transition.getState()

  function notify() {
    for (const observer of observers) {
      observer()
    }
  }

  const get = () => {
    const newState = transition.getState()
    if (state !== newState) {
      state = newState
    }

    if (!transition.isFinished()) {
      if (!futureTask || futureTask.completed) {
        // if phase is rendering
        // execute notify task in next frame
        // else notify
        futureTask = createTask(notify)
        tasks[PRIORITY.FUTURE].push(futureTask)
      }
    }

    return state
  }

  const set = (t?: T) => {
    // need better check if lazy
    const target = t ? t : innerObservable.get()
    // might need cancel task here
    // if (futureTask && !futureTask.cancelled) {
    //   cancelTask(futureTask)
    // }
    transition.setTarget(target)

    if (!transition.isFinished()) {
      notify()
    }
  }

  innerObservable.observe(set)

  return {
    get,
    observe(observer) {
      observers.push(observer)

      return () => {
        removeFirstElementOccurrence(observers, observer)
      }
    },
    setTransition(newTransition) {
      newTransition.setTarget(transition.getTarget())
      transition = newTransition
    },
  }
}
