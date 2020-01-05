import { Observer, uuid, ObserverCallbackFunc, oneOf } from '@/shared'
import { Block } from './Block'

export interface IBlockFieldOption {
  id?: string
  acceptInput?: string[]
  type?: string
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

  type: string

  get hasInput() {
    return this.acceptInput.length > 0
  }

  get parent() {
    return this.$b
  }

  get isBlock(): boolean {
    return !!this.block.value
  }

  constructor(name: string, value: T | null = null, opt: IBlockFieldOption = {}) {
    this.name = name
    this.type = opt.type || ''

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
