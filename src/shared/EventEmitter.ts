import { SArray } from './utils'

export interface IEventCallback {
  (...params: any[]): void
}

interface IEventsMap {
  [name: string]: IEventCallback
}

export class EventEmitter<T extends IEventsMap = IEventsMap> {
  protected _events: {
    [name: string]: SArray<IEventCallback>
  }

  constructor() {
    this._events = {}
  }

  events(type: string) {
    if (!this._events[type]) {
      this._events[type] = new SArray()
    }

    return this._events[type]
  }

  on<K extends keyof T>(type: K, func: T[K]) {
    this.events(type as string).pushDistinct(func)
  }

  off<K extends keyof T>(type: K, func: T[K]) {
    this.events(type as string).removeItem(func)
  }

  emit<K extends keyof T>(type: K, ...args: Parameters<T[K]>) {
    this.events(type as string).forEach((func) => func(...args))
  }

  clear() {
    this._events = {}
  }
}
