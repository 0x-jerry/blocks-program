import { toBeTheSameIds } from '@/jest.utils'
import { Workspace } from '../Workspace'
import { Block } from '../Block'

describe('Workspace', () => {
  let $w: Workspace

  beforeEach(() => {
    $w = new Workspace()
  })

  it('add block', () => {
    const a = new Block()
    const b = new Block()

    $w.addBlock(a)
    $w.addBlock(b)

    toBeTheSameIds($w.blockDB, [a, b])
    toBeTheSameIds($w.blockRoots, [a, b])
  })

  it('remove block', () => {
    const a = new Block()
    const b = new Block()
    const c = new Block()

    $w.addBlock(a)
    $w.addBlock(b)
    $w.addBlock(c)

    $w.removeBlock(b)

    toBeTheSameIds($w.blockDB, [a, c])
    toBeTheSameIds($w.blockRoots, [c, a])
  })

  it('connect block', () => {
    const a = new Block()
    const b = new Block()
    const c = new Block()

    $w.addBlock(a)
    $w.addBlock(b)
    $w.addBlock(c)

    $w.connectBlock(a, b)
    $w.connectBlock(b, c)

    toBeTheSameIds($w.blockDB, [a, b, c])

    expect(a.next.value).toBe(b)
    expect(b.next.value).toBe(c)
    expect(c.next.value).toBeNull()

    expect(a.previous.value).toBeNull()
    expect(b.previous.value).toBe(a)
    expect(c.previous.value).toBe(b)

    toBeTheSameIds($w.blockRoots, [a])
  })

  it('add connected block', () => {
    const a = new Block()
    const b = new Block()
    const c = new Block()

    $w.connectBlock(a, b)

    $w.addBlock(a)
    $w.addBlock(c)

    toBeTheSameIds($w.blockDB, [a, b, c])

    toBeTheSameIds($w.blockRoots, [a, c])
  })

  it('remove connect block', () => {
    const a = new Block()
    const b = new Block()
    const c = new Block()
    const d = new Block()

    $w.connectBlock(c, d)

    $w.addBlock(a)
    $w.addBlock(b)
    $w.addBlock(c)

    $w.connectBlock(a, b)

    $w.removeBlock(b)
    toBeTheSameIds($w.blockDB, [a, c, d])
    toBeTheSameIds($w.blockRoots, [a, c])

    $w.removeBlock(c)
    toBeTheSameIds($w.blockDB, [a])
    toBeTheSameIds($w.blockRoots, [a])
  })
})
