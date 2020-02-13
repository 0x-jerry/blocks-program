import { Block } from '@/core'
import { BlockSlotField } from '../BlockSlotField'
import { FieldTypes } from '../const'

describe('BlockSlotField', () => {
  let field: BlockSlotField

  beforeEach(() => {
    field = new BlockSlotField('')
  })

  it('new', () => {
    expect(field.type).toEqual(FieldTypes.blockSlot)

    const b = new Block()
    field = new BlockSlotField('', b)
    expect(field.value()).toBe(b)
    expect(b.parent.value).toBe(field)
    expect(field.block.value).toBe(b)
  })

  it('get/set value', () => {
    const a = new Block()
    expect(field.value()).toBe(null)

    a.connectToField(field)

    expect(field.value()).toBe(a)
  })

  it('checkConnection', () => {
    const a = new Block()
    const b = new Block()

    a.options.output = ['number']

    expect(field.checkConnection(a)).toBe(false)
    expect(field.checkConnection(b)).toBe(true)
  })

  it('clone', () => {
    const newField = field.clone()

    expect(newField).not.toBe(field)
    expect(newField.name).toBe(field.name)

    const b = new Block()
    b.connectToField(newField)

    const newField2 = newField.clone()

    expect(newField2).not.toBe(newField)
    expect(newField2.getOptions()).toEqual(newField.getOptions())
    expect(newField2.block.value).not.toBe(newField.block.value)
    expect(newField2.value()).not.toBe(newField.value())
  })
})
