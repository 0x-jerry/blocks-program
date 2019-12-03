import { Workspace } from './Workspace'
import { BlockSlot } from './BlockSlot'

export class Block {
  /**
   * Workspace
   */
  $w: Workspace
  $parent: Block
  $slots: BlockSlot[]

  constructor(workspace: Workspace) {
    this.$w = workspace
    this.$slots = []
  }
}
