import { FieldTypes } from './const'
import { BlockFieldCtor } from '../BlockField'
import { warn } from '@/shared'
import { BlockTextField } from './BlockTextField'
import { BlockSlotField } from './BlockSlotField'
import { BlockDropdownField } from './BlockDropdownField'
import { BlockInputField } from './BlockInputField'

export class FieldUtils {
  ctors: {
    [key: string]: BlockFieldCtor
  }

  constructor() {
    this.ctors = {}
    this._resiterDefualtFields()
  }

  private _resiterDefualtFields() {
    this.set(FieldTypes.text, BlockTextField)
    this.set(FieldTypes.blockSlot, BlockSlotField)
    this.set(FieldTypes.dropdown, BlockDropdownField)
    this.set(FieldTypes.input, BlockInputField)
  }

  get(type: FieldTypes): BlockFieldCtor | null
  get(type: string): BlockFieldCtor | null
  get(type: FieldTypes | string): BlockFieldCtor | null {
    return this.ctors[type as string] || null
  }

  set(type: string, ctor: BlockFieldCtor): void {
    if (this.ctors[type]) {
      warn(FieldUtils.name, `Type ${type} has exist.`)
    }
    this.ctors[type] = ctor
  }
}

export const fieldUtils = new FieldUtils()
