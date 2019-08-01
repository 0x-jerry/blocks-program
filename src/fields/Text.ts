import { Field } from './Field'
import * as SVG from '@svgdotjs/svg.js'
import { BlocksContainer } from '../blocks/Container'

export class FieldText extends Field {
  value: string

  shape: SVG.Text

  constructor(block: BlocksContainer, value: string = '') {
    super(block)
    this.value = value

    this.shape = new SVG.Text()
    this.shape.text(this.value)
    this.updatePosition()
  }

  updatePosition() {
    const pos = { x: 0, y: 5 }
    const previousField = this.getPreviousField()

    if (!previousField) {
      pos.x = 0
      pos.y = 5
    } else {
      pos.x = previousField.rectBox().x2
      pos.y = 5
    }

    this.shape.x(pos.x)
    this.shape.y(pos.y)
  }

  setValue(value: string) {
    this.value = value
    this.update()
  }

  update() {
    this.shape.text(this.value)
    this.block.updateField(this)
  }
}
