import { Workspace } from './Workspace'
import { BlockField } from './BlockField'
import { Observer, ObserverCallbackFunc, uuid, SArray } from '@/shared'

export interface BlockConfigOption {
  name: string
  output: string[]
  next: Boolean
  previous: Boolean
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

  options: BlockConfigOption

  fields: SArray<BlockField>

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
    const output = this.options.output

    return output ? output.length > 0 : false
  }

  constructor(config: Partial<BlockConfigOption> = {}, id: string = uuid()) {
    this.id = id

    this.options = {
      name: '',
      output: [],
      next: true,
      previous: true,
      ...config
    }

    this.fields = new SArray()

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
    return this.fields.find((f) => f.id === nameOrId || f.name === nameOrId) || null
  }

  setWorkspace(w: Workspace | null) {
    this.$w = w
  }

  getFieldByRow(rowIdx = 0) {
    const fields = this.fields.filter((f) => f.rowIdx === rowIdx)
    fields.sort((a, b) => a.colIdx - b.colIdx)

    return fields
  }

  pushField(field: BlockField, rowIdx = 0) {
    const colCount = this.getFieldByRow(rowIdx).length
    field.rowIdx = rowIdx
    field.colIdx = colCount
    field.$b = this

    this.fields.pushDistinct(field)
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

  clone() {
    const block = new Block(this.options)

    for (const field of this.fields) {
      block.pushField(field.clone(), field.rowIdx)
    }

    return block
  }

  destroy() {
    this.previous.update(null)
    this.next.update(null)
    this.parent.update(null)
  }
}
