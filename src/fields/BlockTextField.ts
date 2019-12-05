import { BlockField } from './BlockField'

export class BlockTextField extends BlockField<string> {
  constructor(value = '', idx = 0) {
    super(value, idx)
  }
}
