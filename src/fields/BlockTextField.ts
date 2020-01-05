import { BlockField } from '@/core'
import { FIELD_TYPES } from './const'

export interface IBlockTextFieldOption {
  id?: string
  colIdx?: number
  rowIdx?: number
}

export class BlockTextField extends BlockField<string> {
  constructor(name: string, value = '', opt: IBlockTextFieldOption = {}) {
    super(name, value, { type: FIELD_TYPES.TEXT, ...opt })
  }

  clone() {
    const { id, ...otherOptions } = this.getOptions()

    return new BlockTextField(this.name, this.value() || '', otherOptions)
  }
}
