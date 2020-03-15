export interface ObserverCallbackFunc<T> {
  (now: T, pre: T): void
}

export class Observer<T = any> {
  private _value: T

  private _subs: Set<ObserverCallbackFunc<T>>

  get value() {
    return this._value
  }

  /**
   * Only support immutable value
   */
  constructor(val: T) {
    this._value = val
    this._subs = new Set()
  }

  sub(func: ObserverCallbackFunc<T>) {
    if (!this._subs.has(func)) {
      this._subs.add(func)
    }
  }

  unSub(func: ObserverCallbackFunc<T>) {
    this._subs.delete(func)
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

    for (const func of this._subs) {
      func(newVal, oldValue)
    }
  }
}
