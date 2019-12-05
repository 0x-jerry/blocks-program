import { Block } from './Block'
import { BlockField } from './BlockField'
import { getId, removeArrayItem } from '@/shared'

export class BlockFieldManager {
  fields: BlockField[]

  get block() {
    return this.$b
  }

  /**
   * Field count
   */
  get count() {
    return this.fields.length
  }

  /**
   * Block
   */
  private $b: Block | null

  constructor() {
    this.$b = null
    this.fields = []
  }

  setBlock(block: Block) {
    this.$b = block
  }

  has(fieldOrId: BlockField | string): false | BlockField {
    const id = getId(fieldOrId)

    return this.fields.find((f) => f.id === id) || false
  }

  add(field: BlockField) {
    if (this.has(field)) {
      return
    }

    field.setIndex(this.count + 1)

    this.fields.push(field)
  }

  remove(fieldOrId: BlockField | string) {
    const id = getId(fieldOrId)

    const removedField = this.fields.find((f) => f.id === id)
    if (!removedField) {
      return
    }

    removeArrayItem(this.fields, removedField)
  }
}
