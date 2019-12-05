import { Observer, uid, ObserverCallbackFunc, oneOf } from '@/shared'
import { Block } from '@/core'

/**
 * This is a abstract class, only for test.
 */
export class BlockField<T = any> {
  readonly id: string

  protected _idx: number
  protected _value: Observer<T>

  /**
   * Receive types (input <=> output)
   */
  protected input: string[]

  /**
   * Field is connect to a Block
   */
  block: Observer<Block>

  /**
   * Parent Block
   */
  private $b: Block | null

  get hasInput() {
    return this.input.length > 0
  }

  get parent() {
    return this.$b
  }

  get isBlock(): boolean {
    return !!this.block
  }

  get index(): number {
    return this._idx
  }

  constructor(value: T | null = null, idx = 0, id = uid()) {
    this._idx = idx
    this.id = id
    this.$b = null
    this.input = []
    this._value = new Observer(value)

    this.block = new Observer()
    this.block.sub(this.blockUpdate)
  }

  private blockUpdate: ObserverCallbackFunc<Block> = (now, pre) => {
    pre?.parent.set(null)
    now?.parent.set(this)
  }

  setParent(block: Block) {
    this.$b = block
  }

  /**
   * Whether block can connect to this field
   */
  checkConnection(block: Block): boolean {
    return this.hasInput && oneOf(this.input, block.config.output)
  }

  value(val?: T): T | null {
    if (val !== undefined) {
      this._value.set(val)
    }

    return this._value.value
  }

  setIndex(n: number) {
    this._idx = n
  }
}
