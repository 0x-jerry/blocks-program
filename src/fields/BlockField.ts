import { uid } from '../shared'

export class BlockField {
  readonly id: string
  private _idx: number
  private _row: number

  get row() {
    return this._row
  }

  get idx() {
    return this._idx
  }

  constructor(idx = 0, row = 0, id = uid()) {
    this._idx = idx
    this.id = id
    this._row = row
  }

  setRow(n: number) {
    this._row = n
  }

  setIndex(n: number) {
    this._idx = n
  }
}
