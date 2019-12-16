import { Observer, uuid, ObserverCallbackFunc, oneOf } from '@/shared'
import { Block } from '@/core'

/**
 * This is a abstract class, only for test.
 */
export class BlockField<T = any> {
  /**
   * Parent Block
   */
  private $b: Block | null

  protected _idx: number
  protected _value: T | null

  /**
   * Receive types (input <=> output)
   */
  protected input: string[]

  /**
   * Field is connect to a Block
   */
  block: Observer<Block | null>

  type: string

  readonly id: string
  readonly name: string

  get hasInput() {
    return this.input.length > 0
  }

  get parent() {
    return this.$b
  }

  get isBlock(): boolean {
    return !!this.block.value
  }

  get index(): number {
    return this._idx
  }

  constructor(name: string, value: T | null = null, idx = 0, id = uuid()) {
    this.name = name
    this.type = ''
    this._idx = idx
    this.id = id
    this.$b = null
    this.input = []
    this._value = value

    this.block = new Observer(null)
    this.block.sub(this.blockUpdate)
  }

  private blockUpdate: ObserverCallbackFunc<Block> = (now, pre) => {
    pre?.parent.update(null)
    now?.parent.update(this)
  }

  setParent(block: Block) {
    this.$b = block
  }

  /**
   * Whether block can connect to this field
   */
  checkConnection(block: Block): boolean {
    return this.hasInput && oneOf(this.input, block.config.get('output'))
  }

  value(val?: T): T | null {
    if (val !== undefined) {
      this._value = val
    }

    return this._value
  }

  setIndex(n: number) {
    this._idx = n
  }
}
