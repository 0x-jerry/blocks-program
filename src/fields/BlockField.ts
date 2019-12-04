import { Observer, uid } from '@/shared'

export abstract class BlockField<T = string> {
  readonly id: string

  protected _idx: number
  protected _row: number
  protected _value: Observer<T>

  get row() {
    return this._row
  }

  get index() {
    return this._idx
  }

  constructor(value: T | null = null, idx = 0, row = 0, id = uid()) {
    this._idx = idx
    this.id = id
    this._row = row
    this._value = new Observer(value)
  }

  value(val?: T): T | null {
    if (val !== undefined) {
      this._value.set(val)
    }

    return this._value.value
  }

  setRow(n: number) {
    this._row = n
  }

  setIndex(n: number) {
    this._idx = n
  }
}
