import * as SVG from '@svgdotjs/svg.js'
import { BlockContainer } from '../blocks/Container'
import { Gesture } from '../utils/Gesture'

export abstract class Field {
  /**
   * All sub properties are only read, don't do side effect things
   */
  sourceBlock: BlockContainer
  gesture?: Gesture

  group: SVG.Element

  constructor(block: BlockContainer, group: SVG.Element) {
    this.sourceBlock = block
    this.group = group
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

    this.group.x(pos.x)
    this.group.y(pos.y)
  }

  rectBox() {
    return this.group.bbox()
  }

  dispose() {
    this.group.remove()
  }

  move(x: number, y: number) {
    this.group.transform({
      position: { x, y }
    })
  }

  abstract setValue(...args: any[]): void
  abstract getValue(): string

  /**
   * Return the data that need to save
   */
  toJson() {}
}
