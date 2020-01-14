import { Observer, uuid, ObserverCallbackFunc, oneOf } from '@/shared'
import { Block } from './Block'

export interface IBlockFieldOption {
  id?: string
  acceptInput?: string[]
  shadow?: boolean
  colIdx?: number
  rowIdx?: number
}

/**
 * This is a abstract class, only for test.
 */
export class BlockField<T = any> {
  /**
   * Parent Block
   */
  $b: Block | null

  readonly id: string
  readonly name: string

  protected _value: T

  /**
   * Receive types (input <=> output)
   */
  protected acceptInput: string[]

  /**
   * Field is connect to a Block
   */
  block: Observer<Block | null>

  shadow: boolean
  type: string
  /**
   * Start with 0
   */
  colIdx: number
  /**
   * Start with 0
   */
  rowIdx: number

  get hasInput() {
    return this.acceptInput.length > 0
  }

  get isBlock(): boolean {
    return !!this.block.value
  }

  constructor(name: string, value: T, type: string = 'no-type', opt: IBlockFieldOption = {}) {
    this.name = name
    this.type = type
    this.shadow = !!opt.shadow

    this.id = opt.id || uuid()
    this.$b = null
    this.acceptInput = opt.acceptInput || []
    this._value = value
    this.colIdx = opt.colIdx || 0
    this.rowIdx = opt.rowIdx || 0

    this.block = new Observer(null)
    this.block.sub(this.blockUpdate)
  }

  private blockUpdate: ObserverCallbackFunc<Block> = (now, pre) => {
    pre?.parent.update(null)
    now?.parent.update(this)
  }

  getOptions(): IBlockFieldOption {
    return {
      acceptInput: this.acceptInput,
      id: this.id,
      colIdx: this.colIdx,
      rowIdx: this.rowIdx
    }
  }

  /**
   * Whether block can connect to this field
   */
  checkConnection(block: Block): boolean {
    return this.hasInput && oneOf(this.acceptInput, block.options.output)
  }

  value(val?: T): T | null {
    if (val !== undefined) {
      this._value = val
    }

    return this._value
  }

  clone() {
    const { id, ...otherOption } = this.getOptions()

    return new BlockField(this.name, this.value(), this.type, otherOption)
  }
}
