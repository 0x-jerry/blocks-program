import { ObjectAny } from '@/typedef'

export class Configuration<T extends ObjectAny = {}> {
  private data: T

  constructor(opts: T) {
    this.data = opts
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.data[key]
  }

  set<K extends keyof T>(key: K, val: T[K]): void {
    this.data[key] = val
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
