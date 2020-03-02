import { Factory } from '@/shared/Factory'
import { BlockFieldCtor } from '../BlockField'
import { FieldTypes, BlockTextField, BlockSlotField, BlockDropdownField, BlockInputField } from '.'

export const fieldUtils = new Factory<BlockFieldCtor>()

fieldUtils.set(FieldTypes.text, BlockTextField)
fieldUtils.set(FieldTypes.blockSlot, BlockSlotField)
fieldUtils.set(FieldTypes.dropdown, BlockDropdownField)
fieldUtils.set(FieldTypes.input, BlockInputField)
