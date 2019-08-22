import { Blocks } from '../core/Blocks'
import { Gesture } from '../utils/Gesture'
import { SElement } from '../svg/SVGElement'

export abstract class Field<T = any> {
  /**
   * All sub properties are only read, don't do side effect things
   */
  sourceBlock: Blocks
  gesture?: Gesture

  group: SElement<any>
  value: T

  constructor(block: Blocks, group: SElement<any>) {
    this.sourceBlock = block
    this.group = group
  }

  abstract setValue(value: T): void
  abstract getValue(): T

  updateSourceBlock() {
    this.sourceBlock.updateField(this)
  }

  updatePosition(startX: number, startY: number) {
    const box = this.rectBox()

    const totalHeight = this.sourceBlock.caches.fields.height
    const offsetY = (totalHeight - box.height) / 2

    const pos = {
      x: startX + box.width / 2,
      y: startY + offsetY + box.height / 2
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
