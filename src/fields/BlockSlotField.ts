import { Block, BlockField, IBlockFieldOption } from '@/core'
import { ObserverCallbackFunc } from '@/shared'
import { FieldTypes } from './const'

export class BlockSlotField extends BlockField<Block | null> {
  constructor(name: string, value: Block | null = null, opt: IBlockFieldOption = {}) {
    super(name, value, FieldTypes.blockSlot, opt)

    if (value) {
      value.connectToField(this)
    }

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
    const newField = new BlockSlotField(this.name, null, this.getOptions())

    const block = this.value()?.clone()

    block?.connectToField(newField)

    return newField
  }
}
