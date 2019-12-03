import { uid } from '../shared'

export class BlockField {
  readonly id: string

  constructor(id = uid()) {
    this.id = id
  }
}
