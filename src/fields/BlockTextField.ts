import { BlockField, IBlockFieldOption } from '@/core'
import { FieldTypes } from './const'

export class BlockTextField extends BlockField<string> {
  constructor(name: string, value = '', opt: IBlockFieldOption = {}) {
    super(name, value, { type: FieldTypes.text, ...opt })
  }

  clone() {
    const { id, ...otherOption } = this.getOptions()
    return new BlockTextField(this.name, this.value() || '', otherOption)
  }
}
