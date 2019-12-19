import { BlockTextField } from '@/fields'
import { Text } from '../lib'

export class BlockTextFieldSVG extends Text {
  $f: BlockTextField

  constructor(field: BlockTextField) {
    super()

    this.$f = field

    this.text(this.$f.value() || '')
  }
}
