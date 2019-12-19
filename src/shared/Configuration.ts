import { ObjectAny } from '@/typedef'

export class Configuration<T extends ObjectAny = {}> {
  protected _data: T

  get raw() {
    return this._data
  }

  constructor(opts: T) {
    this._data = opts
  }

  get<K extends keyof T>(key: K): T[K] {
    return this._data[key]
  }

  set<K extends keyof T>(key: K, val: T[K]): void {
    this._data[key] = val
  }

  update(opts: Partial<T>): void
  update<K extends keyof T>(key: K, val: T[K]): void
  update<K extends keyof T>(keyOrOpts: K | Partial<T>, val?: T[K]): void {
    if (typeof keyOrOpts === 'string') {
      this.set(keyOrOpts, val as any)
    } else {
      Object.entries(keyOrOpts).forEach(([key, val]) => {
        this.set(key, val)
      })
    }
  }
}
