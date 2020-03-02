import { BlockField, IBlockFieldOption } from '../BlockField'
import { FieldTypes } from './const'

export class BlockTextField extends BlockField<string> {
  constructor(name: string, value = '', opt: IBlockFieldOption = {}) {
    super(name, value, FieldTypes.text, opt)
  }

  clone() {
    return new BlockTextField(this.name, this.value() || '', this.getOptions())
  }
}
