import { BlockField, IBlockFieldOption } from '@/core'
import { FieldTypes } from './const'

type DropdownOptions = string[][] | { key: string; value?: string }[]

export interface IBlockDropdownFieldOption extends IBlockFieldOption {
  /**
   * [[key, value], [key, value]...]
   * or
   * {key: value, ...}
   */
  options: DropdownOptions
}

export class BlockDropdownField extends BlockField<string> {
  options: { key: string; value: string }[]

  get selected() {
    let select = this.options.find((o) => o.key === this._value)
    select = select || this.options[0] || { key: '', value: '' }

    return select
  }

  constructor(name: string, value: string = '', opt: Partial<IBlockDropdownFieldOption> = {}) {
    super(name, value, FieldTypes.dropdown, opt)

    this._parseOptions(opt.options || [])
  }

  private _parseOptions(opt: DropdownOptions) {
    this.options = []

    let key = ''
    let value = ''

    for (const o of opt) {
      if (Array.isArray(o)) {
        key = o[0] || ''
        value = o[1] ?? key
      } else {
        key = o.key
        value = o.value ?? o.key
      }

      this.options.push({ key, value })
    }
  }

  getOptions(): IBlockDropdownFieldOption {
    const options = super.getOptions()

    return {
      options: this.options,
      ...options
    }
  }

  clone() {
    const newField = new BlockDropdownField(this.name, this.value(), this.getOptions())

    if (this.block.value) {
      const b = this.block.value.clone()
      b.connectToField(newField)
    }

    return newField
  }
}
