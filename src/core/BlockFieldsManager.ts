import { Block } from './Block'
import { BlockField } from '../fields'

export class BlockFieldManager {
  /**
   * Block
   */
  $b: Block

  fields: BlockField[] = []

  constructor(block: Block) {
    this.$b = block
  }

  hasField(field: BlockField): false | BlockField {
    return this.fields.find((f) => f.id === field.id) || false
  }

  addField(field: BlockField) {
    if (!this.hasField(field)) {
      this.fields.push(field)
    }
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
