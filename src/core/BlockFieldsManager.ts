import { Block } from './Block'
import { BlockField } from '../fields'
import { getId, removeArrayItem } from '@/shared'

export class RowFields {
  private fields: {
    [row: number]: BlockField[]
  }

  constructor() {
    this.fields = Object.create(null)
  }

  get(row: number = 0) {
    return this.fields[row] ? this.fields[row] : (this.fields[row] = [])
  }

  add(field: BlockField, row: number = 0) {
    this.get(row).push(field)
  }
}

export class BlockFieldManager {
  fields: BlockField[]

  private rows: RowFields

  get block() {
    return this.$b
  }

  /**
   * Block
   */
  private $b: Block | null

  constructor() {
    this.$b = null
    this.fields = []

    this.rows = new RowFields()
  }

  setBlock(block: Block) {
    this.$b = block
  }

  has(fieldOrId: BlockField | string): false | BlockField {
    const id = getId(fieldOrId)

    return this.fields.find((f) => f.id === id) || false
  }

  add(field: BlockField, row = 0) {
    if (this.has(field)) {
      return
    }

    const count = this.getRowCount(row)

    field.setRow(row)
    field.setIndex(count + 1)

    this.fields.push(field)

    this.rows.add(field, row)
  }

  remove(fieldOrId: BlockField | string) {
    const id = getId(fieldOrId)

    const removedField = this.fields.find((f) => f.id === id)
    if (!removedField) {
      return
    }

    removeArrayItem(this.fields, removedField)

    removeArrayItem(this.rows.get(removedField.row), removedField)
  }

  /**
   * Return the count of fields in that row number.
   * @param row Row number
   */
  getRowCount(row: number): number {
    return this.rows.get(row).length
  }

  /**
   * Return the sorted Fields in row number.
   * @param row Row number
   */
  getRow(row: number): BlockField[] {
    return this.rows.get(row)
  }
}
