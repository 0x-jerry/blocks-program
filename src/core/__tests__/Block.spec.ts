import { Block } from '../Block'

describe('Block', () => {
  it('connectTo', () => {
    const a = new Block()
    const b = new Block()

    a.connectTo(b)

    expect(b.next.value).toBe(a)
    expect(b.parent.value).toBeNull()
    expect(b.isRoot).toBe(true)

    expect(a.next.value).toBeNull()
    expect(a.parent.value).toBe(b)
    expect(a.isRoot).toBe(false)
  })

  it('destroy', () => {
    const a = new Block()
    const b = new Block()

    a.connectTo(b)

    a.destroy()

    expect(b.parent.value).toBeNull()
    expect(b.next.value).toBeNull()
    expect(b.isRoot).toBe(true)

    expect(a.parent.value).toBeNull()
    expect(a.next.value).toBeNull()
    expect(a.isRoot).toBe(true)
  })
})
