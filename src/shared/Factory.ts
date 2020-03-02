import { warn } from './utils'

interface Ctor {
  new (...args: any[]): any
}

export class Factory<T extends Ctor = Ctor> {
  ctors: {
    [key: string]: T | null
  }

  constructor() {
    this.ctors = {}
  }

  get(type: string): T | null {
    return this.ctors[type]
  }

  set(type: string, ctor: T | null) {
    if (this.ctors[type]) {
      warn(Factory.name, `Type ${type} has exist.`)
    }

    this.ctors[type] = ctor
  }
}
