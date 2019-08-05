import { BlockContainer } from '../blocks/Container'
import { Gesture } from '../utils/Gesture'
import { SElement } from '../svg/SVGElement'

export abstract class Field<T = any> {
  /**
   * All sub properties are only read, don't do side effect things
   */
  sourceBlock: BlockContainer
  gesture?: Gesture

  group: SElement
  value: T

  constructor(block: BlockContainer, group: SElement) {
    this.sourceBlock = block
    this.group = group
  }

  abstract setValue(value: T): void
  abstract getValue(): T

  updateSourceBlock() {
    this.sourceBlock.updateField(this)
  }

  updatePosition(startX: number, startY: number) {
    const textBaseLineGap = 4

    const height = this.rectBox().height - textBaseLineGap

    const pos = {
      x: startX,
      y: startY + height
    }

    this.move(pos.x, pos.y)
  }

  rectBox() {
    return this.group.bbox()
  }

  move(x: number, y: number) {
    this.group.move(x, y)
  }

  /**
   * Return the data that need to save
   */
  toJson() {}

  dispose() {
    this.group.dispose()
  }
}
