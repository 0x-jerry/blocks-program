import { Block, BlockField } from '@/core'
import { ObserverCallbackFunc } from '@/shared'
import { FIELD_TYPES } from './const'

export interface IBlockSlotFieldOption {
  id?: string
  colIdx?: number
  rowIdx?: number
}

export class BlockSlotField extends BlockField<Block> {
  get isSlot() {
    return true
  }

  constructor(name: string, value: Block | null = null, opt: IBlockSlotFieldOption = {}) {
    super(name, value, {
      type: FIELD_TYPES.BLOCK_SLOT,
      ...opt
    })

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
    const { id, ...otherOptions } = this.getOptions()

    const newField = new BlockSlotField(this.name, null, otherOptions)

    const block = this.value()?.clone()

    block?.connectToField(newField)

    return newField
  }
}
