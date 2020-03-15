import { Factory } from '@/shared'
import { BlockFieldCtor } from '../BlockField'
import { FieldTypes } from './const'
import { BlockTextField } from './BlockTextField'
import { BlockSlotField } from './BlockSlotField'
import { BlockDropdownField } from './BlockDropdownField'
import { BlockInputField } from './BlockInputField'

export const fieldUtils = new Factory<BlockFieldCtor>()

fieldUtils.set(FieldTypes.text, BlockTextField)
fieldUtils.set(FieldTypes.blockSlot, BlockSlotField)
fieldUtils.set(FieldTypes.dropdown, BlockDropdownField)
fieldUtils.set(FieldTypes.input, BlockInputField)
