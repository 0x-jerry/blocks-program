import { Workspace } from './Workspace'
import { BlockSlot } from './BlockSlot'
import { BlockFieldManager } from './BlockFieldsManager'
import { BlockField } from '@/fields'
import { Observer, ObserverCallbackFunc, uid } from '@/shared'

export interface BlockConfigOption {
  output: string[] | string
  next: Boolean
  previous: Boolean
}

export class BlockConfig {
  output: string[]
  next: Boolean
  previous: Boolean

  constructor(opts: Partial<BlockConfigOption> = {}) {
    this.output = []
    this.next = false
    this.previous = false

    this.update(opts)
  }

  update(opts: Partial<BlockConfigOption> = {}) {
    this.output = (<string[]>[]).concat(opts.output ?? [])

    this.next = opts.next ?? this.next
    this.previous = opts.previous ?? this.next
  }
}

export class Block {
  /**
   * Next block
   */
  next: Observer<Block>
  parent: Observer<Block>
  slots: BlockSlot[]
  fieldManager: BlockFieldManager
  config: BlockConfig

  readonly name: string

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

  constructor(name: string = '', id: string = uid()) {
    this.name = name
    this.id = id
    this.slots = []

    this.config = new BlockConfig()

    this.fieldManager = new BlockFieldManager()
    this.fieldManager.setBlock(this)

    this.next = new Observer()
    this.next.sub(this.nextUpdate)

    this.parent = new Observer()
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

  setBlockConfig(opts: Partial<BlockConfigOption> = {}) {
    this.config.update(opts)
  }

  setWorkspace(w: Workspace | null) {
    this.$w = w
  }

  addField(field: BlockField, row: number = 0) {
    this.fieldManager.add(field, row)
  }

  connectTo(block: Block) {
    this.parent.set(block)
  }

  destroy() {
    this.parent.set(null)
    this.next.set(null)
  }
}
