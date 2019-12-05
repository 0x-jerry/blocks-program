import { Block, BlockConfig } from '../Block'

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
    config.update({
      output: 'number'
    })

    expect(config.output).toEqual(['number'])

    config.update({
      output: ['string']
    })

    expect(config.output).toEqual(['string'])

    config.update({
      next: true
    })

    expect(config.next).toEqual(true)

    config.update({
      previous: true
    })

    expect(config.previous).toEqual(true)
  })
})
