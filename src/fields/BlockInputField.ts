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

    this.value(value)
  }

  getOptions(): IBlockInputFieldOption {
    const options = super.getOptions()

    return {
      inputType: this.inputType,
      ...options
    }
  }

  value(val?: string): string {
    if (val === undefined) {
      return this._value
    }

    let value = val

    if (this.inputType === 'number') {
      const n = parseFloat(value)

      value = Number.isNaN(n) ? '' : n.toString()
    }

    this._value = value

    return this._value
  }

  clone() {
    const newField = new BlockInputField(this.name, this.value(), this.getOptions())

    if (this.block.value) {
      const b = this.block.value.clone()
      b.connectToField(newField)
    }

    return newField
  }
}
