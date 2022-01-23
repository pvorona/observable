import { Lambda } from '../types'
import { PRIORITY, ORDER } from './constants'

let renderFrameId: undefined | number = undefined

export interface Task {
  completed: boolean
  cancelled: boolean // not used in current implementation
  execute: () => void
}

type Tasks = {
  [value in PRIORITY]: Task[]
}

export const tasksByOrder: Tasks = {
  [PRIORITY.DOM_READ]: [],
  [PRIORITY.COMPUTATION]: [],
  [PRIORITY.DOM_WRITE]: [],
  [PRIORITY.FUTURE]: [],
}

export function createScheduleEffect(performEffect: Lambda): Lambda {
  let task: Task

  return function scheduleEffectIfNeeded() {
    if (task === undefined || task.completed || task.cancelled) {
      task = scheduleTask(performEffect)
    }
    // cancel animation frame if all tasks are cancelled?
    // return () => {
    //   task.cancelled = true
    // }
  }
}

function scheduleRenderIfNeeded() {
  if (renderFrameId) return

  renderFrameId = requestAnimationFrame(render)
}

async function render() {
  for (const order of ORDER) {
    for (const task of tasksByOrder[order]) {
      // "cancel" tasks that were not performed within one frame
      if (task.cancelled) {
        continue
      }
      task.execute()
      task.completed = true
    }
    tasksByOrder[order] = []
  }
  renderFrameId = undefined
  if (tasksByOrder[PRIORITY.FUTURE].length) {
    scheduleRenderIfNeeded()
    tasksByOrder[PRIORITY.DOM_WRITE] = tasksByOrder[PRIORITY.FUTURE]
    tasksByOrder[PRIORITY.FUTURE] = []
  }
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
  tasksByOrder[priority].push(task)
  scheduleRenderIfNeeded()
  return task
}
