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

  updatePosition() {
    const pos = {
      x: 0,
      y: this.rectBox().height 
    }

    const idx = this.sourceBlock.fields.findIndex((f) => f.field === this)

    if (idx >= 0) {
      pos.x = this.sourceBlock.fields.slice(0, idx).reduce((pre, cur) => pre + cur.rectBox().width, 0)
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
