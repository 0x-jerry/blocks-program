import * as SVG from '@svgdotjs/svg.js'
import { BlocksContainer } from '../blocks/Container'
import { Gesture } from '../utils/Gesture'

export abstract class Field {
  /**
   * All sub properties are only read, don't do side effect things
   */
  block: BlocksContainer
  gesture?: Gesture

  shape: SVG.Element

  constructor(block: BlocksContainer, shape: SVG.Element) {
    this.block = block
    this.shape = shape
    this.updatePosition()
  }

  abstract update(): void

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

  getPreviousField(): Field {
    const idx = this.block.fields.indexOf(this)
    return this.block.fields[idx - 1]
  }

  getNextField() {
    const idx = this.block.fields.indexOf(this)
    return this.block.fields[idx + 1]
  }

  rectBox() {
    return this.shape.bbox()
  }

  dispose() {
    this.shape.remove()
  }

  move(x: number, y: number) {
    this.shape.transform({
      position: { x, y }
    })
  }

  /**
   * Return the data that need to save
   */
  toJson() {}
}
