import { Workspace } from './Workspace'
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
  /**
   * Previous block
   */
  previous: Observer<Block>
  /**
   * Parent field
   */
  parent: Observer<BlockField>

  config: BlockConfig

  fieldManager: BlockFieldManager

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
    return !this.previous.value && !this.parent.value
  }

  get hasOutput() {
    return this.config.output.length > 0
  }

  constructor(name: string = '', id: string = uid()) {
    this.name = name
    this.id = id

    this.config = new BlockConfig()

    this.fieldManager = new BlockFieldManager()
    this.fieldManager.setBlock(this)

    this.next = new Observer()
    this.next.sub(this.nextUpdate)

    this.previous = new Observer()
    this.previous.sub(this.previousUpdate)

    this.parent = new Observer()
    this.parent.sub(this.parentUpdate)
  }

  private nextUpdate: ObserverCallbackFunc<Block> = (now, pre) => {
    pre?.previous.set(null)
    now?.previous.set(this)
  }

  private previousUpdate: ObserverCallbackFunc<Block> = (now, pre) => {
    pre?.next.set(null)
    now?.next.set(this)
  }

  private parentUpdate: ObserverCallbackFunc<BlockField> = (now, pre) => {
    pre?.block.set(null)
    now?.block.set(this)
  }

  setBlockConfig(opts: Partial<BlockConfigOption> = {}) {
    this.config.update(opts)
  }

  setWorkspace(w: Workspace | null) {
    this.$w = w
  }

  addField(field: BlockField) {
    this.fieldManager.add(field)
  }

  connectTo(block: Block) {
    this.previous.set(block)
  }

  connectToField(field: BlockField) {
    if (field.checkConnection(this)) {
      this.parent.set(field)
    }
  }

  destroy() {
    this.previous.set(null)
    this.next.set(null)
    this.parent.set(null)
  }
}
