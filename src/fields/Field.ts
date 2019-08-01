import * as SVG from '@svgdotjs/svg.js'
import { BlocksContainer } from '../blocks/Container'
import { Gesture } from '../utils/Gesture'

export abstract class Field {
  /**
   * All sub properties are only read, don't do side effect things
   */
  block: BlocksContainer
  gesture?: Gesture

  abstract shape: SVG.Element

  constructor(block: BlocksContainer) {
    this.block = block
  }

  abstract update(): void
  abstract updatePosition(): void

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
  toJson() {

  }
}
