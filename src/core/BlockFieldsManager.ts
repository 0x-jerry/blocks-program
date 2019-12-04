import { Block } from './Block'
import { BlockField } from '../fields'
import { getId, removeArrayItem } from '@/shared'

export class BlockFieldManager {
  /**
   * Block
   */
  $b: Block

  fields: BlockField[] = []

  constructor(block: Block) {
    this.$b = block
  }

  has(fieldOrId: BlockField | string): false | BlockField {
    const id = getId(fieldOrId)

    return this.fields.find((f) => f.id === id) || false
  }

  add(field: BlockField) {
    if (!this.has(field)) {
      this.fields.push(field)
    }
  }

  remove(fieldOrId: BlockField | string) {
    const id = getId(fieldOrId)

    removeArrayItem(this.fields, (f) => f.id === id)
  }

  /**
   * Return the count of fields in that row number.
   * @param row Row number
   */
  getRowCount(row: number): number {
    return this.fields.filter((f) => f.row === row).length
  }

  /**
   * Return the sorted Fields in row number.
   * @param row Row number
   */
  getRow(row: number): BlockField[] {
    const fields = this.fields.filter((f) => f.row === row)

    fields.sort((a, b) => (a.idx > b.idx ? -1 : 1))

    return fields
  }
}
