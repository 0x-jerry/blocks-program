import { Field } from '../fields/Field'
import { BlockContainer } from './Container'

export class BlockFiled {
  field: Field
  fieldBlock?: BlockContainer

  sourceBlock: BlockContainer

  constructor(source: BlockContainer, field: Field) {
    this.sourceBlock = source
    this.field = field
    this.fieldBlock = null
  }

  updatePosition() {
    if (this.fieldBlock) {
      this.fieldBlock.update()
    } else {
      this.field.updatePosition()
    }
  }

  updateField(fieldBlock?: BlockContainer) {
    this.fieldBlock = fieldBlock
  }

  rectBox() {
    if (this.fieldBlock) {
      return this.fieldBlock.rectBox()
    } else {
      return this.field.rectBox()
    }
  }
}
