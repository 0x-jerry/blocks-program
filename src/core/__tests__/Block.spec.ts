import { Block, BlockConfig } from '../Block'
import { BlockTextField, BlockSlotField } from '@/fields'

describe('Block', () => {
  it('connectTo', () => {
    const a = new Block()
    const b = new Block()

    a.connectTo(b)

    expect(b.next.value).toBe(a)
    expect(b.previous.value).toBeNull()
    expect(b.isRoot).toBe(true)

    expect(a.next.value).toBeNull()
    expect(a.previous.value).toBe(b)
    expect(a.isRoot).toBe(false)

    a.connectTo(null)

    expect(b.next.value).toBeNull()
    expect(b.previous.value).toBeNull()
    expect(b.isRoot).toBe(true)

    expect(a.next.value).toBeNull()
    expect(a.previous.value).toBeNull()
    expect(a.isRoot).toBe(true)
  })

  it('connectToField', () => {
    const a = new Block()
    const f1 = new BlockTextField()

    a.connectToField(f1)
    expect(a.parent.value).toBe(null)
    expect(f1.block.value).toBe(null)

    const f2 = new BlockSlotField()
    a.connectToField(f2)
    expect(a.parent.value).toBe(f2)
    expect(f2.block.value).toBe(a)

    a.connectToField(null)
    expect(a.parent.value).toBe(null)
    expect(f2.block.value).toBe(null)
  })

  it('destroy', () => {
    const a = new Block()
    const b = new Block()

    a.connectTo(b)

    a.destroy()

    expect(b.previous.value).toBeNull()
    expect(b.next.value).toBeNull()
    expect(b.isRoot).toBe(true)

    expect(a.previous.value).toBeNull()
    expect(a.next.value).toBeNull()
    expect(a.isRoot).toBe(true)
  })
})

describe('Block Config', () => {
  let config: BlockConfig
  beforeEach(() => {
    config = new BlockConfig()
  })

  it('default value', () => {
    expect(config.output).toEqual([])
    expect(config.next).toBe(false)
    expect(config.previous).toBe(false)
  })

  it('update', () => {
    config.update('output', 'number')

    expect(config.output).toEqual(['number'])

    config.update({
      output: ['string']
    })

    expect(config.output).toEqual(['string'])

    config.update('next', true)

    expect(config.next).toEqual(true)

    config.update({
      previous: true
    })

    expect(config.previous).toEqual(true)
  })
})
