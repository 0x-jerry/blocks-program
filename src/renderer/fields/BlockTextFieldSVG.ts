import { BlockTextField } from '@/fields'
import { Text } from '../lib'
import { FieldSVG } from './FieldSVG'
import { BlockSVG } from '../BlockSVG'

export class BlockTextFieldSVG extends FieldSVG<BlockTextField, Text> {
  constructor(block: BlockSVG, field: BlockTextField) {
    super(block, field, new Text())

    this.svg.addClasses('s_field_text')
    this.svg.text(this.$f.value() || '')
  }
}
