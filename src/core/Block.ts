import { Workspace } from './Workspace'
import { BlockFieldManager } from './BlockFieldsManager'
import { BlockField } from './BlockField'
import { Observer, ObserverCallbackFunc, uid, Configuration } from '@/shared'

export interface BlockConfigOption {
  name: string
  output: string[]
  next: Boolean
  previous: Boolean
}

export class BlockConfig extends Configuration<BlockConfigOption> {
  constructor(opts: Partial<BlockConfigOption> = {}) {
    const defaultOpts: BlockConfigOption = {
      name: '',
      output: [],
      next: false,
      previous: false
    }

    super(Object.assign(defaultOpts, opts))
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

  get hasOutput(): boolean {
    const output = this.config.get('output')

    return output ? output.length > 0 : false
  }

  constructor(config: Partial<BlockConfigOption> = {}, id: string = uid()) {
    this.id = id

    this.config = new BlockConfig(config)

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

  setWorkspace(w: Workspace | null) {
    this.$w = w
  }

  addField(field: BlockField) {
    this.fieldManager.add(field)
  }

  /**
   * @param block Null to break
   */
  connectTo(block: Block | null) {
    this.previous.set(block)
  }

  /**
   * @param field Null to break
   */
  connectToField(field: BlockField | null) {
    if (!field) {
      this.parent.set(null)
      return
    }

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
