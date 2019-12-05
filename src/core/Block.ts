import { Workspace } from './Workspace'
import { BlockFieldManager } from './BlockFieldsManager'
import { BlockField } from '@/fields'
import { Observer, ObserverCallbackFunc, uid } from '@/shared'

export interface BlockConfigOption {
  name: string
  output: string[] | string
  next: Boolean
  previous: Boolean
}

export class BlockConfig implements BlockConfigOption {
  name: string
  output: string[]
  next: Boolean
  previous: Boolean

  constructor(opts: Partial<BlockConfigOption> = {}) {
    /**
     * Do not modify directly, use update instead
     */
    this.output = []
    /**
     * Do not modify directly, use update instead
     */
    this.next = false
    /**
     * Do not modify directly, use update instead
     */
    this.previous = false
    /**
     * Do not modify directly, use update instead
     */
    this.name = ''

    this.update(opts)
  }

  private set(key: keyof BlockConfigOption, val: any) {
    if (key === 'output') {
      this.output = [].concat(val)
    } else {
      this[key] = val
    }
  }

  update(opts: Partial<BlockConfigOption>): void
  update<T extends keyof BlockConfigOption>(key: T, val: BlockConfigOption[T]): void
  update<T extends keyof BlockConfigOption>(
    optsOrKey: Partial<BlockConfigOption> | T,
    val?: BlockConfigOption[T]
  ): void {
    if (typeof optsOrKey === 'string') {
      this.set(optsOrKey, val)
    } else {
      Object.entries(optsOrKey).forEach(([key, value]) => {
        this.set(key as any, value)
      })
    }
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

  get hasOutput() {
    return this.config.output.length > 0
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
