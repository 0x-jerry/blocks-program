import { BlockTextField } from '../BlockTextField'
import { Block } from '@/core'
import { FieldTypes } from '../const'

describe('BlockTextField', () => {
  let field: BlockTextField

  beforeEach(() => {
    field = new BlockTextField('')
  })

  it('get/set value', () => {
    expect(field.value()).toBe('')

    field.value('123')
    expect(field.value()).toBe('123')
  })

  it('checkConnect', () => {
    const a = new Block()
    const b = new Block()

    expect(field.checkConnection(a)).toBe(false)

    b.config.output = ['number', 'string']

    expect(field.checkConnection(b)).toBe(false)
  })

  it('type', () => {
    expect(field.type).toBe(FieldTypes.text)
  })

  it('clone', () => {
    const newField = field.clone()

    expect(newField).not.toBe(field)
    expect(newField.value()).toBe(field.value())
  })
})
