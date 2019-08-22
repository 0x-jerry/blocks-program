import { Field } from '../fields/Field'
import { Blocks } from './Blocks'

export class BlockFiled {
  field: Field
  fieldBlock?: Blocks

  sourceBlock: Blocks

  constructor(source: Blocks, field: Field) {
    this.sourceBlock = source
    this.field = field
    this.fieldBlock = null
  }

  updatePosition() {
    if (this.fieldBlock) {
      this.fieldBlock.updateShapeWithoutCache()
    } else {
      const pos = {
        x: 0,
        y: this.sourceBlock.style.paddingTop
      }

      const idx = this.sourceBlock.fields.findIndex((f) => f.field === this.field)

      if (idx >= 0) {
        pos.x = this.sourceBlock.fields.slice(0, idx).reduce((pre, cur) => pre + cur.rectBox().width, 0)
      }

      this.field.updatePosition(pos.x, pos.y)
    }
  }

  updateField(fieldBlock?: Blocks) {
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
