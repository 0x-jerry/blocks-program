import { Field } from './Field'
import * as SVG from '@svgdotjs/svg.js'
import { BlocksContainer } from '../blocks/Container'

export class FieldLabel extends Field {
  value: string

  shape: SVG.Text

  constructor(block: BlocksContainer, value: string = '') {
    const shape = new SVG.Text()
    shape.text(value)

    super(block, shape)

    this.value = value
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
