import { BlockField, IBlockFieldOption } from '@/core'
import { FieldTypes } from './const'

export interface IBlockDropdownFieldOption extends IBlockFieldOption {
  /**
   * [[key, value], [key, value]...]
   */
  options: string[][]
}

export class BlockDropdownField extends BlockField<string> {
  /**
   * [[key, value], [key, value]...]
   */
  options: string[][]

  constructor(name: string, value: string = '', opt: Partial<IBlockDropdownFieldOption> = {}) {
    super(name, value, FieldTypes.dropdown, opt)

    this.options = opt.options || []

    this._parseOptions()
  }

  private _parseOptions() {
    for (let i = 0; i < this.options.length; i++) {
      const o = this.options[i]
      const key = o[0] ?? ''
      const value = o[1] ?? key

      this.options[i] = [key, value]
    }
  }

  value() {
    return this._value
  }

  getOptions(): IBlockDropdownFieldOption {
    const options = super.getOptions()

    return {
      options: this.options,
      ...options
    }
  }

  clone() {
    const { id, ...otherOption } = this.getOptions()

    const newField = new BlockDropdownField(this.name, this.value(), otherOption)

    if (this.block.value) {
      const b = this.block.value.clone()
      b.connectToField(newField)
    }

    return newField
  }
}
