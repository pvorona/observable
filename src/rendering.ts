import { Lambda } from './types'

// const INTERACTING = 'INTERACTING'
// const RENDERING = 'RENDERING'
// const queue = {
//   phase: INTERACTING,
// }

export function createScheduleEffect(performEffect: Lambda): Lambda {
  // export function performEffect (original: Lambda, priority = TASK.DOM_WRITE): Lambda {
  let task: Task

  return function scheduleEffectIfNeeded() {
    if (task === undefined || task.completed || task.cancelled) {
      task = scheduleTask(performEffect)
      // task = scheduleTask(original, priority)
    }
  }
}

// function computation (compute: () => void): () => void {
//   let task: Task

//   function wrappedComputation () {
//     if (queue.phase === RENDERING) {
//       compute()
//     } else {
//       if (task === undefined || task.completed || task.cancelled) {
//         task = scheduleTask(compute, TASK.COMPUTATION)
//       }
//     }
//   }

//   return wrappedComputation
// }

let renderFrameId: undefined | number = undefined

function scheduleRenderIfNeeded() {
  if (renderFrameId) return

  renderFrameId = requestAnimationFrame(render)
}

export enum PRIORITY {
  DOM_READ = 'DOM_READ',
  COMPUTATION = 'COMPUTATION',
  DOM_WRITE = 'DOM_WRITE',
  FUTURE = 'FUTURE',
}

const ORDER = [PRIORITY.DOM_READ, PRIORITY.COMPUTATION, PRIORITY.DOM_WRITE]

type Tasks = {
  [value in PRIORITY]: Task[]
}

export const tasks: Tasks = {
  [PRIORITY.DOM_READ]: [],
  [PRIORITY.COMPUTATION]: [],
  [PRIORITY.DOM_WRITE]: [],
  [PRIORITY.FUTURE]: [],
}

function render() {
  // console.log('-----------------------------')
  // console.log('FRAME START')
  // queue.phase = RENDERING
  for (const order of ORDER) {
    for (const task of tasks[order]) {
      if (!task.cancelled) {
        task.execute()
        task.completed = true
      }
    }
    tasks[order] = []
  }
  renderFrameId = undefined
  if (tasks[PRIORITY.FUTURE].length) {
    tasks[PRIORITY.DOM_WRITE] = tasks[PRIORITY.FUTURE]
    tasks[PRIORITY.FUTURE] = []
    scheduleRenderIfNeeded()
  }
  // queue.phase = INTERACTING
  // console.log('FRAME END')
  // console.log('-----------------------------')
}

export interface Task {
  completed: boolean
  cancelled: boolean
  execute: () => void
}

export function createTask(callback: () => void): Task {
  return {
    completed: false,
    cancelled: false,
    execute: callback,
  }
}

function scheduleTask(callback: () => void, priority = PRIORITY.DOM_WRITE) {
  const task = createTask(callback)
  tasks[priority].push(task)
  scheduleRenderIfNeeded()
  return task
}
