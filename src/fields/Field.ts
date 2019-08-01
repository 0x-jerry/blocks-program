import * as SVG from '@svgdotjs/svg.js'
import { BlocksContainer } from '../blocks/Container'

export abstract class Field {
  /**
   * All sub properties are only read, don't do side effect things
   */
  block: BlocksContainer

  abstract shape: SVG.Element

  preField?: Field
  nextField?: Field

  constructor(block: BlocksContainer) {
    this.block = block
    this.preField = block.fields[block.fields.length - 1]
  }

  abstract update(): void
  abstract updatePosition(): void

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
}
