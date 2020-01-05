import { BlockField, IBlockFieldOption } from '@/core'
import { FIELD_TYPES } from './const'

export class BlockTextField extends BlockField<string> {
  constructor(name: string, value = '', opt: IBlockFieldOption = {}) {
    super(name, value, { type: FIELD_TYPES.TEXT, ...opt })
  }

  clone() {
    const { id, ...otherOption } = this.getOptions()
    return new BlockTextField(this.name, this.value() || '', otherOption)
  }
}
