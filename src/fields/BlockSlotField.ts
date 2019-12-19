import { Block, BlockField } from '@/core'
import { ObserverCallbackFunc } from '@/shared'
import { FIELD_TYPES } from './const'

export class BlockSlotField extends BlockField<Block> {
  get isSlot() {
    return true
  }

  constructor(name: string, value: Block | null = null, idx = 0) {
    super(name, value, idx)
    this.type = FIELD_TYPES.BLOCK_SLOT
    this.block.sub(this.blockChanged)
  }

  private blockChanged: ObserverCallbackFunc<Block> = (now, pre) => {
    this._value = now
  }

  /**
   * Whether block can connect to this field
   */
  checkConnection(block: Block): boolean {
    return !block.hasOutput
  }

  value() {
    return this._value
  }

  clone() {
    const newField = new BlockSlotField(this.name, null, this.index)

    const block = this.value()?.clone()

    block?.connectToField(newField)

    return newField
  }
}
