import { BlockField } from '../BlockField'
import { Block } from '../Block'

describe('BlockField', () => {
  let field: BlockField

  beforeEach(() => {
    field = new BlockField('name')
  })

  it('get/set value', () => {
    expect(field.value()).toBeNull()

    field.value(1)
    expect(field.value()).toBe(1)

    field.value('1')
    expect(field.value()).toBe('1')
  })

  it('setParent', () => {
    const a = new Block()

    expect(field.parent).toBe(null)

    field.setParent(a)
    expect(field.parent).toBe(a)
  })

  it('checkConnection', () => {
    const a = new Block()

    expect(field.checkConnection(a)).toBe(false)
  })

  it('isBlock', () => {
    expect(field.isBlock).toBe(false)
  })
})
