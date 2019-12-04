export interface ObserverCallbackFunc<T> {
  (now: T | null, pre: T | null): void
}

export class Observer<T = any> {
  private _value: T | null

  private subs: ObserverCallbackFunc<T>[]

  get value() {
    return this._value
  }

  /**
   * Only support immutable value
   */
  constructor(val: T | null = null) {
    this._value = val
    this.subs = []
  }

  sub(func: ObserverCallbackFunc<T>) {
    if (this.subs.indexOf(func) < 0) {
      this.subs.push(func)
    }
  }

  unSub(func: ObserverCallbackFunc<T>) {
    const idx = this.subs.indexOf(func)

    if (idx >= 0) {
      this.subs.splice(idx, 1)
    }
  }

  set(newVal: T) {
    if (this._value === newVal) {
      return
    }

    const oldValue = this._value

    this._value = newVal

    this.subs.forEach((func) => {
      func(newVal, oldValue)
    })
  }
}
