import { Workspace } from './Workspace'
import { BlockSlot } from './BlockSlot'
import { uid } from '../shared'
import { BlockFieldManager } from './BlockFieldsManager'
import { BlockField } from '@/fields'
import { Observer, ObserverCallbackFunc } from '@/shared/Observer'

export class Block {
  /**
   * Next block
   */
  next: Observer<Block>
  parent: Observer<Block>
  slots: BlockSlot[]
  fieldManager: BlockFieldManager

  readonly id: string

  /**
   * Workspace
   */
  private $w: Workspace | null

  get workspace() {
    return this.$w
  }

  get isRoot(): boolean {
    return !this.parent.value
  }

  get hasSlot(): boolean {
    return this.slots.length > 0
  }

  constructor(id: string = uid()) {
    this.id = id
    this.fieldManager = new BlockFieldManager(this)
    this.slots = []
    this.parent = new Observer()
    this.next = new Observer()

    this.next.sub(this.nextUpdate)
    this.parent.sub(this.parentUpdate)
  }

  private nextUpdate: ObserverCallbackFunc<Block> = (now, pre) => {
    pre?.parent.set(null)
    now?.parent.set(this)
  }

  private parentUpdate: ObserverCallbackFunc<Block> = (now, pre) => {
    pre?.next.set(null)
    now?.next.set(this)
  }

  setWorkspace(w: Workspace | null) {
    this.$w = w
  }

  addField(field: BlockField, row: number = 0) {
    const count = this.fieldManager.getRowCount(row)

    field.setRow(row)
    field.setIndex(count + 1)

    this.fieldManager.add(field)
  }

  connectTo(block: Block) {
    this.parent.set(block)
  }

  destroy() {
    this.parent.set(null)
    this.next.set(null)
  }
}
