(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.observable = {}));
})(this, (function (exports) { 'use strict';

    function collectValues(sources) {
        const values = [];
        for (let i = 0; i < sources.length; i++) {
            values.push(sources[i].get());
        }
        return values;
    }

    function removeFirstElementOccurrence(array, element) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === element) {
                array.splice(i, 1);
                return;
            }
        }
    }

    function shallowEqual(a, b) {
        for (const key in a) {
            if (a[key] !== b[key])
                return false;
        }
        return true;
    }

    function observable(initialValue) {
        let value = initialValue;
        const observers = [];
        function notify() {
            for (const observer of observers) {
                observer(value);
            }
        }
        return {
            set(newValueOrFactory) {
                const newValue = newValueOrFactory instanceof Function
                    ? newValueOrFactory(value)
                    : newValueOrFactory;
                if (newValue === value) {
                    return;
                }
                value = newValue;
                notify();
            },
            get() {
                return value;
            },
            // fire immediately can solve Gettable dependency
            observe(observer) {
                observers.push(observer);
                return () => {
                    removeFirstElementOccurrence(observers, observer);
                };
            },
        };
    }
    // export function pureObservable <A> (
    //   // initialValue: A,
    // ): Observable<A> & Settable<A> {
    //   const observers: Observer<A>[] = []
    //   return {
    //     set (value) {
    //       observers.forEach(observer => observer(value))
    //     },
    //     // fire immegiately can solve Gettable dependency
    //     observe (observer: Observer<A>) {
    //       observers.push(observer)
    //       return () => {
    //         for (let i = 0; i < observers.length; i++) {
    //           if (observers[i] === observer) {
    //             observers.splice(i, 1)
    //             return
    //           }
    //         }
    //       }
    //     },
    //   }
    // }
    // function gettable <A> (observable: Observable<A>): Gettable<A> {
    //   let value: A
    //   observable.observe(newValue => value = newValue)
    //   function get () {
    //     return value
    //   }
    //   return { get }
    // }

    const DEFAULT_OPTIONS = {
        collectValues: true,
        fireImmediately: true,
    };
    function observe(deps, externalObserver, { fireImmediately = DEFAULT_OPTIONS.fireImmediately, collectValues: collectValues$1 = DEFAULT_OPTIONS.collectValues, } = DEFAULT_OPTIONS) {
        // Negate to prevent function allocation when possible
        const observer = !collectValues$1
            ? externalObserver
            : () => externalObserver(...collectValues(deps));
        const unobserves = deps.map(dep => dep.observe(observer));
        if (fireImmediately) {
            observer();
        }
        return () => {
            unobserves.forEach(unobserve => unobserve());
        };
    }

    function compute(deps, compute) {
        const obs = observable(undefined);
        observe(deps, (...values) => {
            obs.set(compute(...values));
        });
        return {
            get: obs.get,
            observe: obs.observe,
        };
    }

    function computeLazy(deps, compute) {
        const observers = [];
        let value;
        let dirty = true;
        observe(deps, markDirty, { fireImmediately: false, collectValues: false });
        function markDirty() {
            dirty = true;
            for (const observer of observers) {
                observer();
            }
        }
        function recompute() {
            const values = collectValues(deps);
            return compute(...values);
        }
        return {
            get() {
                if (dirty) {
                    value = recompute();
                    dirty = false;
                }
                return value;
            },
            observe(observer) {
                observers.push(observer);
                return () => {
                    removeFirstElementOccurrence(observers, observer);
                };
            },
        };
    }

    // const INTERACTING = 'INTERACTING'
    // const RENDERING = 'RENDERING'
    // const queue = {
    //   phase: INTERACTING,
    // }
    function createScheduleEffect(performEffect) {
        // export function performEffect (original: Lambda, priority = TASK.DOM_WRITE): Lambda {
        let task;
        return function scheduleEffectIfNeeded() {
            if (task === undefined || task.completed || task.cancelled) {
                task = scheduleTask(performEffect);
                // task = scheduleTask(original, priority)
            }
        };
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
    let renderFrameId = undefined;
    function scheduleRenderIfNeeded() {
        if (renderFrameId)
            return;
        renderFrameId = requestAnimationFrame(render);
    }
    var PRIORITY;
    (function (PRIORITY) {
        PRIORITY["DOM_READ"] = "DOM_READ";
        PRIORITY["COMPUTATION"] = "COMPUTATION";
        PRIORITY["DOM_WRITE"] = "DOM_WRITE";
        PRIORITY["FUTURE"] = "FUTURE";
    })(PRIORITY || (PRIORITY = {}));
    const ORDER = [PRIORITY.DOM_READ, PRIORITY.COMPUTATION, PRIORITY.DOM_WRITE];
    const tasks = {
        [PRIORITY.DOM_READ]: [],
        [PRIORITY.COMPUTATION]: [],
        [PRIORITY.DOM_WRITE]: [],
        [PRIORITY.FUTURE]: [],
    };
    function render() {
        // console.log('-----------------------------')
        // console.log('FRAME START')
        // queue.phase = RENDERING
        for (const order of ORDER) {
            for (const task of tasks[order]) {
                if (!task.cancelled) {
                    task.execute();
                    task.completed = true;
                }
            }
            tasks[order] = [];
        }
        renderFrameId = undefined;
        if (tasks[PRIORITY.FUTURE].length) {
            tasks[PRIORITY.DOM_WRITE] = tasks[PRIORITY.FUTURE];
            tasks[PRIORITY.FUTURE] = [];
            scheduleRenderIfNeeded();
        }
        // queue.phase = INTERACTING
        // console.log('FRAME END')
        // console.log('-----------------------------')
    }
    function createTask(callback) {
        return {
            completed: false,
            cancelled: false,
            execute: callback,
        };
    }
    function scheduleTask(callback, priority = PRIORITY.DOM_WRITE) {
        const task = createTask(callback);
        tasks[priority].push(task);
        scheduleRenderIfNeeded();
        return task;
    }

    function effect(deps, observer, createScheduleEffect$1 = createScheduleEffect) {
        let hasScheduledEffect = false;
        const scheduleEffect = createScheduleEffect$1(function performEffect() {
            const values = collectValues(deps);
            observer(...values);
            hasScheduledEffect = false;
        });
        const scheduleNotify = () => {
            if (hasScheduledEffect) {
                return;
            }
            hasScheduledEffect = true;
            scheduleEffect();
        };
        return observe(deps, scheduleNotify, { collectValues: false });
    }

    function animationObservable(innerObservable, initialTransition) {
        const observers = [];
        let futureTask = undefined;
        let transition = initialTransition;
        let state = transition.getState();
        function notify() {
            for (const observer of observers) {
                observer();
            }
        }
        const get = () => {
            const newState = transition.getState();
            if (state !== newState) {
                state = newState;
            }
            if (!transition.isFinished()) {
                if (!futureTask || futureTask.completed) {
                    // if phase is rendering
                    // execute notify task in next frame
                    // else notify
                    futureTask = createTask(notify);
                    tasks[PRIORITY.FUTURE].push(futureTask);
                }
            }
            return state;
        };
        const set = (t) => {
            // need better check if lazy
            const target = t ? t : innerObservable.get();
            // might need cancel task here
            // if (futureTask && !futureTask.cancelled) {
            //   cancelTask(futureTask)
            // }
            transition.setTarget(target);
            if (!transition.isFinished()) {
                notify();
            }
        };
        innerObservable.observe(set);
        return {
            get,
            observe(observer) {
                observers.push(observer);
                return () => {
                    removeFirstElementOccurrence(observers, observer);
                };
            },
            setTransition(newTransition) {
                newTransition.setTarget(transition.getTarget());
                transition = newTransition;
            },
        };
    }

    function transition(initialValue, duration, easing) {
        let startTime = performance.now();
        let startValue = initialValue;
        let targetValue = initialValue;
        let finished = true;
        const getState = () => {
            const progress = Math.min((performance.now() - startTime) / duration, 1);
            if (progress === 1) {
                finished = true;
            }
            return startValue + (targetValue - startValue) * easing(progress);
        };
        const isFinished = () => finished;
        const setTarget = (target) => {
            if (target === targetValue) {
                return;
            }
            startValue = getState();
            targetValue = target;
            finished = false;
            startTime = performance.now();
        };
        function getTarget() {
            return targetValue;
        }
        return {
            getState,
            isFinished,
            setTarget,
            getTarget,
        };
    }
    function groupTransition(transitions) {
        let state = computeState();
        function computeState() {
            const newState = {};
            for (const key in transitions) {
                newState[key] = transitions[key].getState();
            }
            return newState;
        }
        function getState() {
            const newState = computeState();
            if (shallowEqual(state, newState)) {
                // Preserve referential transparency for selectors
                return state;
            }
            state = newState;
            return state;
        }
        function setTarget(target) {
            for (const key in target) {
                transitions[key].setTarget(target[key]);
            }
        }
        function isFinished() {
            for (const key in transitions) {
                if (!transitions[key].isFinished())
                    return false;
            }
            return true;
        }
        function getTarget() {
            const result = {};
            for (const key in transitions) {
                result[key] = transitions[key].getTarget();
            }
            return result;
        }
        return {
            setTarget,
            isFinished,
            getState,
            getTarget,
        };
    }

    exports.animationObservable = animationObservable;
    exports.collectValues = collectValues;
    exports.compute = compute;
    exports.computeLazy = computeLazy;
    exports.effect = effect;
    exports.groupTransition = groupTransition;
    exports.observable = observable;
    exports.observe = observe;
    exports.removeFirstElementOccurrence = removeFirstElementOccurrence;
    exports.shallowEqual = shallowEqual;
    exports.transition = transition;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
