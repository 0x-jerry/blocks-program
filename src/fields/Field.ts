import * as SVG from '@svgdotjs/svg.js'
import { BlockContainer } from '../blocks/Container'
import { Gesture } from '../utils/Gesture'
import { BlockFiled } from '../blocks/BlockField';

export abstract class Field {
  /**
   * All sub properties are only read, don't do side effect things
   */
  sourceBlock: BlockContainer
  gesture?: Gesture

  shape: SVG.Element

  constructor(block: BlockContainer, shape: SVG.Element) {
    this.sourceBlock = block
    this.shape = shape
    this.updatePosition()
  }

  updateSourceBlock() {
    this.sourceBlock.updateField(this)
  }

  updatePosition() {
    const pos = {
      x: 0,
      y: this.sourceBlock.style.paddingTop
    }

    const previousField = this.sourceBlock.getPreviousField(this)

    if (previousField) {
      pos.x = previousField.rectBox().x2
    }

    this.shape.x(pos.x)
    this.shape.y(pos.y)
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
