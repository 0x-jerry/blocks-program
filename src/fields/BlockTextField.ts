import { BlockField } from '@/core'

export class BlockTextField extends BlockField<string> {
  constructor(name: string, value = '', idx = 0) {
    super(name, value, idx)
    this.type = 'Text'
    this.input = []
  }
}
