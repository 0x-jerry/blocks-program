export interface ObserverCallbackFunc<T> {
  (now: T, pre: T): void
}

export class Observer<T = any> {
  private _value: T

  private subs: ObserverCallbackFunc<T>[]

  get value() {
    return this._value
  }

  /**
   * Only support immutable value
   */
  constructor(val: T) {
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

  update(newVal: T, updateOnly = false) {
    if (this._value === newVal) {
      return
    }

    const oldValue = this._value

    this._value = newVal

    if (updateOnly) {
      return
    }

    this.subs.forEach((func) => {
      func(newVal, oldValue)
    })
  }
}
