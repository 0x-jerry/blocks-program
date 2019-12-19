import { BlockField } from '@/core'
import { FIELD_TYPES } from './const'

export class BlockTextField extends BlockField<string> {
  constructor(name: string, value = '', idx = 0) {
    super(name, value, idx)
    this.type = FIELD_TYPES.TEXT
    this.input = []
  }

  clone() {
    return new BlockTextField(this.name, this.value() || '', this.index)
  }
}
