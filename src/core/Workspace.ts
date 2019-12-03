import { uid } from '../shared'
import { Block } from './Block'

export class Workspace {
  readonly id: string
  blockDB: Block[]

  constructor(id: string = uid()) {
    this.id = id
    this.blockDB = []
  }
}
