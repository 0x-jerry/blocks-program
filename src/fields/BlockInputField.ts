import { BlockField, IBlockFieldOption } from '@/core'
import { FieldTypes } from './const'

export interface IBlockInputFieldOption extends IBlockFieldOption {
  inputType: 'number' | 'string'
}

export class BlockInputField extends BlockField<string> {
  inputType: 'number' | 'string'

  constructor(name: string, value: string = '', opt: Partial<IBlockInputFieldOption> = {}) {
    super(name, value, FieldTypes.input, opt)

    this.inputType = opt.inputType || 'string'
  }

  value() {
    return this._value
  }

  getOptions(): IBlockInputFieldOption {
    const options = super.getOptions()

    return {
      inputType: this.inputType,
      ...options
    }
  }

  clone() {
    const { id, ...otherOption } = this.getOptions()

    const newField = new BlockInputField(this.name, this.value(), otherOption)

    if (this.block.value) {
      const b = this.block.value.clone()
      b.connectToField(newField)
    }

    return newField
  }
}
