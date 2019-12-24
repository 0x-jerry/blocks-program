import { BlockTextField } from '@/fields'
import { Text } from '../lib'
import { FieldSVG } from './FieldSVG'

export class BlockTextFieldSVG extends FieldSVG<BlockTextField, Text> {
  constructor(field: BlockTextField) {
    super(field, new Text())

    this.svg.addClasses('s_field_text')
    this.svg.text(this.$f.value() || '')
  }
}
