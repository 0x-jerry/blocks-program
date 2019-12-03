import { Workspace } from './Workspace'
import { BlockSlot } from './BlockSlot'
import { uid } from '../shared'
import { BlockFieldManager } from './BlockFieldsManager'

export class Block {
  /**
   * Workspace
   */
  $w: Workspace

  parent: Block
  slots: BlockSlot[]
  fieldManager: BlockFieldManager

  readonly id: string

  constructor(workspace: Workspace, id: string = uid()) {
    this.id = id
    this.$w = workspace
    this.fieldManager = new BlockFieldManager(this)
    this.slots = []
  }
}
