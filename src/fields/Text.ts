import { Field } from './Field'
import * as SVG from '@svgdotjs/svg.js'
import { BlocksContainer } from '../blocks/Container'

export class FieldText extends Field {
  value: string = ''

  shape: SVG.Text

  constructor(block: BlocksContainer, value: string = '') {
    super(block)
    this.value = value

    this.shape = new SVG.Text()
    this.shape.text(this.value)
    this.updatePosition()
  }

  updatePosition() {
    if (!this.preField) {
      this.shape.x(0)
      this.shape.y(5)
    } else {
      const x = this.preField.rectBox().x2
      this.shape.x(x)
      this.shape.y(5)
    }
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
