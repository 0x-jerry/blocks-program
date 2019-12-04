import { Workspace } from './Workspace'
import { BlockSlot } from './BlockSlot'
import { uid } from '../shared'
import { BlockFieldManager } from './BlockFieldsManager'
import { BlockField } from '@/fields'

export class Block {
  /**
   * Workspace
   */
  $w: Workspace

  /**
   * Next block
   */
  next: Block | null
  parent: Block | null
  slots: BlockSlot[]
  fieldManager: BlockFieldManager

  readonly id: string

  get isRoot(): boolean {
    return !!this.parent
  }

  get hasSlot(): boolean {
    return this.slots.length > 0
  }

  constructor(workspace: Workspace, id: string = uid()) {
    this.id = id
    this.$w = workspace
    this.fieldManager = new BlockFieldManager(this)
    this.slots = []
    this.parent = null
    this.next = null
  }

  addField(field: BlockField, row: number = 0) {
    const idx = this.fieldManager.getRowCount(row)

    field.setRow(row)
    field.setIndex(idx)

    this.fieldManager.addField(field)
  }

  destroy() {
    if (this.next) {
      this.next.parent = null
    }
  }
}
