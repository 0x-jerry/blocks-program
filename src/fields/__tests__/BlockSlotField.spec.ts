import { Block } from '@/core'
import { BlockSlotField } from '../BlockSlotField'

describe('BlockSlotField', () => {
  let field: BlockSlotField

  beforeEach(() => {
    field = new BlockSlotField()
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

    a.config.update({
      output: ['number']
    })

    field.input = ['number']

    expect(field.checkConnection(a)).toBe(false)
    expect(field.checkConnection(b)).toBe(true)
  })
})
