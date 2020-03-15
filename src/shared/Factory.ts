import { warn } from './utils'

interface Ctor {
  new (...args: any[]): any
}

export class Factory<T extends Ctor = Ctor, K = string | Symbol> {
  ctors: Map<K, T>

  constructor() {
    this.ctors = new Map()
  }

  get(type: K): T | null {
    return this.ctors.get(type) || null
  }

  set(type: K, ctor: T | null) {
    if (this.ctors.get(type)) {
      warn(Factory.name, `Type ${type} has exist.`)
    }

    if (ctor) {
      this.ctors.set(type, ctor)
    }
  }
}
