import { Block } from '@/core'
import { BlockSlotField } from '../BlockSlotField'
import { FieldTypes } from '../const'

describe('BlockSlotField', () => {
  let field: BlockSlotField

  beforeEach(() => {
    field = new BlockSlotField('')
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

    a.config.output = ['number']

    expect(field.checkConnection(a)).toBe(false)
    expect(field.checkConnection(b)).toBe(true)
  })

  it('type', () => {
    expect(field.isSlot).toBe(true)
    expect(field.type).toBe(FieldTypes.blockSlot)
  })

  it('clone', () => {
    const newField = field.clone()

    expect(newField).not.toBe(field)
    expect(newField.name).toBe(field.name)
  })
})
