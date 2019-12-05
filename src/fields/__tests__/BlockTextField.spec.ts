import { BlockTextField } from '../BlockTextField'
import { Block } from '@/core'

describe('BlockTextField', () => {
  let field: BlockTextField

  beforeEach(() => {
    field = new BlockTextField()
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

    b.config.update('output', ['number', 'string'])

    expect(field.checkConnection(b)).toBe(false)
  })
})
