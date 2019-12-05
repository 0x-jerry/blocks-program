import { Block, BlockField } from '@/core'
import { ObserverCallbackFunc } from '@/shared'

export class BlockSlotField extends BlockField<Block> {
  get isSlot() {
    return true
  }

  constructor(value: Block | null = null, idx = 0) {
    super(value, idx)
    this.block.sub(this.blockChanged)
  }

  private blockChanged: ObserverCallbackFunc<Block> = (now, pre) => {
    this._value.set(now)
  }

  /**
   * Whether block can connect to this field
   */
  checkConnection(block: Block): boolean {
    return !block.hasOutput
  }

  value() {
    return this._value.value
  }
}
