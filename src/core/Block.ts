import { Workspace } from './Workspace'
import { BlockFieldManager } from './BlockFieldsManager'
import { BlockField } from './BlockField'
import { Observer, ObserverCallbackFunc, uuid, Configuration } from '@/shared'

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
  next: Observer<Block | null>
  /**
   * Previous block
   */
  previous: Observer<Block | null>
  /**
   * Parent field
   */
  parent: Observer<BlockField | null>

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

  constructor(config: Partial<BlockConfigOption> = {}, id: string = uuid()) {
    this.id = id

    this.config = new BlockConfig(config)

    this.fieldManager = new BlockFieldManager()
    this.fieldManager.setBlock(this)

    this.next = new Observer(null)
    this.next.sub(this.nextUpdate)

    this.previous = new Observer(null)
    this.previous.sub(this.previousUpdate)

    this.parent = new Observer(null)
    this.parent.sub(this.parentUpdate)
  }

  private nextUpdate: ObserverCallbackFunc<Block | null> = (now, pre) => {
    pre?.previous.update(null)
    now?.previous.update(this)
  }

  private previousUpdate: ObserverCallbackFunc<Block | null> = (now, pre) => {
    pre?.next.update(null)
    now?.next.update(this)
  }

  private parentUpdate: ObserverCallbackFunc<BlockField | null> = (now, pre) => {
    pre?.block.update(null)
    now?.block.update(this)
  }

  getField(nameOrId: string): BlockField | null {
    return this.fieldManager.fields.find((f) => f.name === nameOrId || f.id === nameOrId) ?? null
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
    this.previous.update(block)
  }

  /**
   * @param field Null to break
   */
  connectToField(field: BlockField | null) {
    if (!field) {
      this.parent.update(null)
      return
    }

    if (field.checkConnection(this)) {
      this.parent.update(field)
    }
  }

  destroy() {
    this.previous.update(null)
    this.next.update(null)
    this.parent.update(null)
  }
}
