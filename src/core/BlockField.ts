import { Observer, uuid, ObserverCallbackFunc, oneOf } from '@/shared'
import { FIELD_TYPES } from '@/fields'
import { Block } from './Block'

export interface IBlockFieldOption {
  id?: string
  colIdx?: number
  rowIdx?: number
  acceptInput?: string[]
  type: FIELD_TYPES | string
}

/**
 * This is a abstract class, only for test.
 */
export class BlockField<T = any> {
  /**
   * Parent Block
   */
  private $b: Block | null

  readonly id: string
  readonly name: string

  protected _value: T | null

  /**
   * Receive types (input <=> output)
   */
  protected acceptInput: string[]

  /**
   * Field is connect to a Block
   */
  block: Observer<Block | null>

  type: FIELD_TYPES | string

  colIdx: number
  rowIdx: number

  get hasInput() {
    return this.acceptInput.length > 0
  }

  get parent() {
    return this.$b
  }

  get isBlock(): boolean {
    return !!this.block.value
  }

  constructor(name: string, value: T | null = null, opt: IBlockFieldOption = { type: FIELD_TYPES.TEXT }) {
    this.name = name
    this.type = opt.type
    this.colIdx = opt.colIdx || 0
    this.rowIdx = opt.rowIdx || 0

    this.id = opt.id || uuid()
    this.$b = null
    this.acceptInput = opt.acceptInput || []
    this._value = value

    this.block = new Observer(null)
    this.block.sub(this.blockUpdate)
  }

  private blockUpdate: ObserverCallbackFunc<Block> = (now, pre) => {
    pre?.parent.update(null)
    now?.parent.update(this)
  }

  getOptions() {
    return {
      colIdx: this.colIdx,
      rowIdx: this.rowIdx,
      acceptInput: this.acceptInput,
      type: this.type,
      id: this.id
    }
  }

  setParent(block: Block) {
    this.$b = block
  }

  /**
   * Whether block can connect to this field
   */
  checkConnection(block: Block): boolean {
    return this.hasInput && oneOf(this.acceptInput, block.config.get('output'))
  }

  value(val?: T): T | null {
    if (val !== undefined) {
      this._value = val
    }

    return this._value
  }

  clone() {
    const { id, ...otherOption } = this.getOptions()

    return new BlockField(this.name, this.value(), otherOption)
  }
}
